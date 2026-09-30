import { useQuery } from '@tanstack/react-query';
import type {
  GameAnswerResult,
  GameResultsView,
  GameSessionView,
  PublicQuestion,
  ScoreBreakdownView,
} from '@world-challenge/shared';
import {
  difficultyLabel,
  GameMode,
  GameStatus,
  GameType,
  QUIZ_COUNTDOWN_MS,
  rankTitle,
} from '@world-challenge/shared';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageState } from '../../components/ui/PageState';
import { useAuthStore } from '../../features/auth/auth-store';
import { WorldMapPicker } from '../../features/games/WorldMapPicker';
import { getSession, getSessionResults, joinSession } from '../../services/api';
import { connectGameSocket } from '../../services/socket';

export function GameSessionPage() {
  const { id } = useParams();
  const user = useAuthStore((state) => state.user);
  const [session, setSession] = useState<GameSessionView | null>(null);
  const [question, setQuestion] = useState<PublicQuestion | null>(null);
  const [results, setResults] = useState<GameResultsView | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [breakdown, setBreakdown] = useState<ScoreBreakdownView | null>(null);
  const [socketError, setSocketError] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());
  const [selected, setSelected] = useState<string | null>(null);
  const [lockedIds, setLockedIds] = useState<Set<string>>(() => new Set());
  const [copied, setCopied] = useState(false);

  const sessionQuery = useQuery({
    queryKey: ['session', id],
    queryFn: async () => {
      if (!id) {
        throw new Error('Missing session');
      }
      try {
        return await getSession(id);
      } catch {
        return joinSession(id);
      }
    },
    enabled: Boolean(id),
  });

  useEffect(() => {
    if (sessionQuery.data) {
      setSession(sessionQuery.data);
      setQuestion(sessionQuery.data.currentQuestion);
      setLockedIds(
        new Set(
          sessionQuery.data.players
            .filter((player) => player.answeredThisRound)
            .map((player) => player.userId),
        ),
      );
    }
  }, [sessionQuery.data]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!id || !user) {
      return;
    }

    const socket = connectGameSocket();
    const onJoined = (payload: { session: GameSessionView }) => {
      setSession(payload.session);
      setQuestion(payload.session.currentQuestion);
      setLockedIds(
        new Set(
          payload.session.players
            .filter((player) => player.answeredThisRound)
            .map((player) => player.userId),
        ),
      );
      const me = payload.session.players.find((player) => player.userId === user.id);
      if (
        payload.session.mode === GameMode.SOLO &&
        payload.session.status === GameStatus.WAITING &&
        me &&
        !me.ready
      ) {
        socket.emit('game:ready', { sessionId: id });
      }
    };
    const onQuestion = (payload: { session: GameSessionView; question: PublicQuestion }) => {
      setSession(payload.session);
      setQuestion(payload.question);
      setCorrectAnswer(null);
      setExplanation(null);
      setLastResult(null);
      setBreakdown(null);
      setSelected(null);
      setLockedIds(new Set());
    };
    const onAnswer = (payload: GameAnswerResult) => {
      const comboTag =
        payload.combo > 1 ? ` · combo x${payload.combo}` : '';
      const speedTag =
        payload.breakdown.speedBonus > 0
          ? ` · +${payload.breakdown.speedBonus} speed`
          : '';
      if (payload.isCorrect) {
        setLastResult(`Hit · +${payload.points}${comboTag}${speedTag}`);
      } else {
        setLastResult(
          payload.points > 0 ? `Off target · +${payload.points}` : 'Miss · combo broken',
        );
      }
      setBreakdown(payload.breakdown);
    };
    const onLockIn = (payload: { userId: string; questionId: string }) => {
      setLockedIds((current) => {
        const next = new Set(current);
        next.add(payload.userId);
        return next;
      });
    };
    const onRound = (payload: {
      session: GameSessionView;
      correctAnswer: string;
      explanation?: string | null;
    }) => {
      setSession(payload.session);
      setCorrectAnswer(payload.correctAnswer);
      setExplanation(payload.explanation ?? null);
    };
    const onResults = (payload: { results: GameResultsView }) => {
      setResults(payload.results);
    };
    const onError = (payload: { message: string }) => {
      setSocketError(payload.message);
    };

    socket.on('game:joined', onJoined);
    socket.on('game:player_joined', onJoined);
    socket.on('game:player_ready', onJoined);
    socket.on('game:started', onJoined);
    socket.on('game:question', onQuestion);
    socket.on('game:answer_result', onAnswer);
    socket.on('game:lock_in', onLockIn);
    socket.on('game:round_complete', onRound);
    socket.on('game:next_round', onJoined);
    socket.on('game:finished', onJoined);
    socket.on('game:results', onResults);
    socket.on('game:error', onError);

    const join = () => socket.emit('game:join', { sessionId: id });
    if (socket.connected) {
      join();
    }
    socket.on('connect', join);

    return () => {
      socket.off('connect', join);
      socket.off('game:joined', onJoined);
      socket.off('game:player_joined', onJoined);
      socket.off('game:player_ready', onJoined);
      socket.off('game:started', onJoined);
      socket.off('game:question', onQuestion);
      socket.off('game:answer_result', onAnswer);
      socket.off('game:lock_in', onLockIn);
      socket.off('game:round_complete', onRound);
      socket.off('game:next_round', onJoined);
      socket.off('game:finished', onJoined);
      socket.off('game:results', onResults);
      socket.off('game:error', onError);
    };
  }, [id, user]);

  const remainingSeconds = useMemo(() => {
    if (!question) {
      return 0;
    }
    return Math.max(0, Math.ceil((new Date(question.endsAt).getTime() - now) / 1000));
  }, [now, question]);

  const timerRatio = question
    ? Math.max(0, Math.min(1, remainingSeconds / (question.timeLimitMs / 1000)))
    : 0;
  const timerHot = remainingSeconds > 0 && remainingSeconds <= 5;

  if (!id) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <PageState title="Missing" body="No session id." />
      </main>
    );
  }

  if (sessionQuery.isPending && !session) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <PageState title="Loading" body="Opening the game room…" />
      </main>
    );
  }

  if (sessionQuery.isError && !session) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <PageState title="Error" body="This game room could not be opened." />
      </main>
    );
  }

  const view = session ?? sessionQuery.data;
  if (!view) {
    return null;
  }

  const mePlayer = view.players.find((player) => player.userId === user?.id);
  const playing = view.status === GameStatus.PLAYING && question;
  const waiting = view.status === GameStatus.WAITING || view.status === GameStatus.READY;
  const countdownLeft =
    view.status === GameStatus.COUNTDOWN && view.startedAt
      ? Math.max(
          0,
          Math.ceil((new Date(view.startedAt).getTime() + QUIZ_COUNTDOWN_MS - now) / 1000),
        )
      : 0;

  function readyUp(): void {
    connectGameSocket().emit('game:ready', { sessionId: id });
  }

  function submit(option: string): void {
    if (!question || selected) {
      return;
    }
    setSelected(option);
    connectGameSocket().emit('game:answer', {
      sessionId: id,
      questionId: question.questionId,
      answer: option,
    });
  }

  async function loadResults(): Promise<void> {
    if (!id) {
      return;
    }
    const payload = await getSessionResults(id);
    setResults(payload);
  }

  async function copyInvite(): Promise<void> {
    if (!id) {
      return;
    }
    const url = `${window.location.origin}/games/${id}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold">
            {view.gameName} · {view.mode} · {view.status.replaceAll('_', ' ')}
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold uppercase">Arena</h1>
        </div>
        {view.mode !== GameMode.SOLO ? (
          <button
            type="button"
            onClick={() => void copyInvite()}
            className="rounded-xl border border-cyan/30 px-4 py-2 text-xs font-bold uppercase tracking-wider text-cyan"
          >
            {copied ? 'Invite copied' : 'Copy invite link'}
          </button>
        ) : null}
      </div>
      {socketError ? <p className="mt-3 text-sm text-ember">{socketError}</p> : null}

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {view.players.map((player) => {
          const locked = lockedIds.has(player.userId) || player.answeredThisRound;
          const isMe = player.userId === user?.id;
          return (
            <article
              key={player.userId}
              className={[
                'rounded-2xl border p-4',
                isMe ? 'border-cyan/40 bg-cyan/5' : 'border-white/10 bg-panel/80',
              ].join(' ')}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display font-bold">{player.username}</p>
                  <p className="text-xs uppercase text-mist">
                    {player.countryFlag} {player.countryName}
                  </p>
                </div>
                <span className="rounded-full border border-gold/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold">
                  {player.combo > 1 ? `Combo x${player.combo}` : player.ready ? 'Ready' : 'Standby'}
                </span>
              </div>
              <p className="mt-2 font-display text-3xl text-gold">{player.score}</p>
              {playing ? (
                <p className={['mt-1 text-xs uppercase tracking-wider', locked ? 'text-cyan' : 'text-mist'].join(' ')}>
                  {locked ? 'Locked in' : 'Reading the board'}
                </p>
              ) : null}
            </article>
          );
        })}
        {view.players.length < view.maxPlayers ? (
          <article className="rounded-2xl border border-dashed border-white/15 p-4 text-sm text-mist">
            Waiting for the second player. Copy the invite link so they can join this room.
          </article>
        ) : null}
      </div>

      {waiting ? (
        <div className="mt-6 rounded-[28px] border border-white/10 bg-void p-6">
          <p className="text-sm text-mist">
            Both players must ready up. Solo starts as soon as you are ready. Later rounds get
            harder; streaks multiply the payout.
          </p>
          <button
            type="button"
            disabled={mePlayer?.ready}
            onClick={readyUp}
            className="mt-4 rounded-2xl bg-gold px-5 py-3 font-display text-sm font-extrabold uppercase text-void disabled:opacity-50"
          >
            {mePlayer?.ready ? 'Waiting for opponent' : 'Ready'}
          </button>
        </div>
      ) : null}

      {view.status === GameStatus.COUNTDOWN ? (
        <div className="mt-6 rounded-[28px] border border-cyan/30 bg-cyan/5 p-6 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan">
            Live in
          </p>
          <p className="countdown-digit mt-2 font-display text-7xl font-extrabold text-paper">
            {countdownLeft || 1}
          </p>
          <p className="mt-2 text-sm text-mist">Questions stay hidden until the server opens the round.</p>
        </div>
      ) : null}

      {playing ? (
        <section className="mt-6 rounded-[28px] border border-white/10 bg-panel/80 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-mist">
                Round {question.round} / {question.totalRounds}
              </p>
              <div className="mt-2 flex gap-1">
                {Array.from({ length: question.totalRounds }, (_, index) => (
                  <span
                    key={index}
                    className={[
                      'h-1.5 w-6 rounded-full',
                      index < question.round ? 'bg-cyan' : 'bg-white/15',
                    ].join(' ')}
                  />
                ))}
              </div>
            </div>
            <span className="rounded-full border border-magenta/40 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-magenta">
              {difficultyLabel(question.difficulty)}
            </span>
            <p className={['font-display text-3xl font-extrabold', timerHot ? 'text-ember' : 'text-cyan'].join(' ')}>
              {remainingSeconds}s
            </p>
          </div>
          <div className="timer-track mt-4">
            <div
              className={['timer-fill', timerHot ? 'timer-fill-hot' : ''].join(' ')}
              style={{ width: `${timerRatio * 100}%` }}
            />
          </div>
          {question.imageUrl ? (
            <img
              src={question.imageUrl}
              alt=""
              className="mt-4 h-28 w-auto rounded-xl border border-white/10"
            />
          ) : null}
          <h2 className="mt-4 font-display text-2xl font-bold">{question.prompt}</h2>
          {view.gameType === GameType.WORLD_MAP || question.options.length === 0 ? (
            <WorldMapPicker disabled={Boolean(selected)} onConfirm={submit} />
          ) : (
            <div className="mt-4 grid gap-2">
              {question.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  disabled={Boolean(selected)}
                  onClick={() => submit(option)}
                  className={[
                    'rounded-2xl border px-4 py-3 text-left font-semibold',
                    selected === option
                      ? 'border-cyan bg-cyan/15 text-paper'
                      : 'border-white/10 bg-void hover:border-cyan/40',
                  ].join(' ')}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
          {lastResult ? (
            <p className={['mt-4 text-sm', lastResult.startsWith('Hit') ? 'text-gold combo-chip' : 'text-mist'].join(' ')}>
              {lastResult}
            </p>
          ) : null}
          {breakdown && breakdown.combo > 1 ? (
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-magenta">
              Streak multiplier x{breakdown.comboMultiplier.toFixed(2)}
            </p>
          ) : null}
        </section>
      ) : null}

      {view.status === GameStatus.ROUND_COMPLETE && correctAnswer ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-void p-4 text-sm text-mist">
          <p>
            Answer: <span className="text-paper">{correctAnswer}</span>
          </p>
          {explanation ? <p className="mt-2 leading-6">{explanation}</p> : null}
        </div>
      ) : null}

      {view.status === GameStatus.FINISHED || results ? (
        <section className="mt-6 rounded-[28px] border border-gold/30 bg-void p-6">
          <h2 className="font-display text-2xl font-extrabold">Match recap</h2>
          {!results ? (
            <button
              type="button"
              onClick={() => void loadResults()}
              className="mt-4 rounded-xl bg-cyan px-4 py-2 text-sm font-bold text-void"
            >
              Load server results
            </button>
          ) : (
            <>
              <div className="mt-4 space-y-3">
                {results.players.map((player) => {
                  const recap = results.recap.find((entry) => entry.userId === player.userId);
                  return (
                    <article
                      key={player.userId}
                      className="rounded-2xl border border-white/10 bg-panel/70 p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-display text-lg font-bold">
                          {player.username}
                          {results.winnerUserId === player.userId ? ' · Winner' : ''}
                        </p>
                        <p className="text-gold">
                          {player.score} pts · +{player.xpAwarded} XP
                        </p>
                      </div>
                      {recap ? (
                        <p className="mt-2 text-xs uppercase tracking-wider text-mist">
                          {recap.accuracy}% accuracy · peak combo x{recap.peakCombo} · avg{' '}
                          {Math.round(recap.avgResponseMs / 100) / 10}s
                          {recap.fastestCorrectMs != null
                            ? ` · fastest ${(recap.fastestCorrectMs / 1000).toFixed(1)}s`
                            : ''}
                        </p>
                      ) : (
                        <p className="mt-2 text-xs text-mist">
                          {player.correctAnswers} correct
                        </p>
                      )}
                    </article>
                  );
                })}
              </div>
              {results.unlockedCountries.length > 0 ? (
                <p className="mt-4 text-sm text-cyan">
                  Unlocked:{' '}
                  {results.unlockedCountries
                    .map((item) => `${item.country.flagEmoji ?? ''} ${item.country.name}`)
                    .join(', ')}
                </p>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-3">
                <Link to="/passport" className="text-sm font-semibold text-gold">
                  Open passport
                </Link>
                <Link to="/leaderboard" className="text-sm font-semibold text-cyan">
                  Global ranks
                </Link>
                {user ? (
                  <p className="text-xs uppercase tracking-wider text-mist">
                    Your rank: {rankTitle(user.level)}
                  </p>
                ) : null}
              </div>
            </>
          )}
        </section>
      ) : null}
    </main>
  );
}
