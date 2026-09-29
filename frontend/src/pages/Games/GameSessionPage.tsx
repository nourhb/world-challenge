import { useQuery } from '@tanstack/react-query';
import type {
  GameResultsView,
  GameSessionView,
  PublicQuestion,
} from '@world-challenge/shared';
import { GameMode, GameStatus, GameType } from '@world-challenge/shared';
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
  const [socketError, setSocketError] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());
  const [selected, setSelected] = useState<string | null>(null);

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
      setSelected(null);
    };
    const onAnswer = (payload: { isCorrect: boolean; points: number }) => {
      if (payload.isCorrect) {
        setLastResult(`Hit · +${payload.points}`);
        return;
      }
      setLastResult(payload.points > 0 ? `Off target · +${payload.points}` : 'Miss · +0');
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

  return (
    <main className="mx-auto max-w-4xl px-4 py-6 lg:px-8">
      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold">
        {view.gameName} · {view.mode}
      </p>
      <h1 className="mt-2 font-display text-3xl font-extrabold uppercase">{view.status}</h1>
      <p className="mt-2 break-all text-xs text-mist">Session {view.id}</p>
      {socketError ? <p className="mt-3 text-sm text-ember">{socketError}</p> : null}

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {view.players.map((player) => (
          <article key={player.userId} className="rounded-2xl border border-white/10 bg-panel/80 p-4">
            <p className="font-display font-bold">{player.username}</p>
            <p className="text-xs uppercase text-mist">
              {player.countryFlag} {player.countryName} · {player.ready ? 'Ready' : 'Not ready'}
            </p>
            <p className="mt-2 font-display text-2xl text-gold">{player.score}</p>
          </article>
        ))}
        {view.players.length < view.maxPlayers ? (
          <article className="rounded-2xl border border-dashed border-white/15 p-4 text-sm text-mist">
            Waiting for the second player. Share this session id or have them open the invite from Home.
          </article>
        ) : null}
      </div>

      {waiting ? (
        <div className="mt-6 rounded-[28px] border border-white/10 bg-void p-6">
          <p className="text-sm text-mist">
            Both players must ready up. Solo starts as soon as you are ready.
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
        <div className="mt-6 rounded-[28px] border border-cyan/30 bg-cyan/5 p-6">
          <p className="font-display text-2xl font-extrabold">Countdown</p>
          <p className="text-sm text-mist">Questions stay hidden until the server starts the round.</p>
        </div>
      ) : null}

      {playing ? (
        <section className="mt-6 rounded-[28px] border border-white/10 bg-panel/80 p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-wider text-mist">
              Round {question.round} / {question.totalRounds}
            </p>
            <p className="font-display text-2xl font-extrabold text-cyan">{remainingSeconds}s</p>
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
          {lastResult ? <p className="mt-4 text-sm text-gold">{lastResult}</p> : null}
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
          <h2 className="font-display text-2xl font-extrabold">Results</h2>
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
              <div className="mt-4 space-y-2">
                {results.players.map((player) => (
                  <p key={player.userId} className="text-sm">
                    {player.username}: {player.score} pts · {player.correctAnswers} correct · +
                    {player.xpAwarded} XP
                    {results.winnerUserId === player.userId ? ' · Winner' : ''}
                  </p>
                ))}
              </div>
              {results.unlockedCountries.length > 0 ? (
                <p className="mt-4 text-sm text-cyan">
                  Unlocked:{' '}
                  {results.unlockedCountries
                    .map((item) => `${item.country.flagEmoji ?? ''} ${item.country.name}`)
                    .join(', ')}
                </p>
              ) : null}
              <Link to="/passport" className="mt-4 inline-block text-sm font-semibold text-gold">
                Open passport
              </Link>
            </>
          )}
        </section>
      ) : null}
    </main>
  );
}
