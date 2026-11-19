import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ACTIONS,
  applyAction,
  freshProgress,
  loadProgress,
  loggedOn,
  saveProgress,
  type ActionId,
  type Progress,
} from "@/lib/progress";
import {
  defaultModelSettings,
  loadModelSettings,
  saveModelSettings,
  type ModelSettings,
} from "@/lib/model";

export type ToolId = "bmi" | "body" | "diet" | "chat";

const TOOLS: ToolId[] = ["bmi", "body", "diet", "chat"];

type Store = {
  tool: ToolId;
  selectTool: (id: ToolId, scroll?: boolean) => void;
  articleId: string | null;
  openArticle: (id: string) => void;
  docId: string | null;
  openDoc: (id: string) => void;
  closeOverlay: () => void;
  progress: Progress;
  loggedToday: ActionId[];
  setName: (name: string) => void;
  logAction: (id: ActionId) => boolean;
  toggleChallenge: () => void;
  togglePledge: () => void;
  resetProgress: () => void;
  importProgress: (imported: Progress) => void;
  toast: string | null;
  setToast: (msg: string | null) => void;
  model: ModelSettings;
  setModel: (patch: Partial<ModelSettings>) => void;
};

const StoreContext = createContext<Store | null>(null);

function isTool(value: string): value is ToolId {
  return TOOLS.includes(value as ToolId);
}

function readLocation(): { tool?: ToolId; articleId?: string; docId?: string } {
  const hash = window.location.hash.replace("#", "");
  if (hash.startsWith("tool-") && isTool(hash.slice(5))) return { tool: hash.slice(5) as ToolId };
  if (hash.startsWith("article-")) return { articleId: hash.slice(8) };
  if (hash.startsWith("doc-")) return { docId: hash.slice(4) };
  return {};
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [tool, setTool] = useState<ToolId>("bmi");
  const [articleId, setArticleId] = useState<string | null>(null);
  const [docId, setDocId] = useState<string | null>(null);
  const [progress, setProgress] = useState<Progress>(() => freshProgress());
  const [model, setModelState] = useState<ModelSettings>(() => defaultModelSettings());
  const [toast, setToastState] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
    setModelState(loadModelSettings());
    const sync = (scroll: boolean) => {
      const next = readLocation();
      if (next.tool) {
        setTool(next.tool);
        if (scroll) {
          requestAnimationFrame(() => {
            document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" });
          });
        }
      }
      setArticleId(next.articleId ?? null);
      setDocId(next.docId ?? null);
    };
    sync(true);
    setReady(true);
    const onHash = () => sync(true);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (ready) saveProgress(progress);
  }, [progress, ready]);

  useEffect(() => {
    if (ready) saveModelSettings(model);
  }, [model, ready]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToastState(null), 3600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const api = useMemo<Store>(() => {
    return {
      tool,
      selectTool: (id, scroll = false) => {
        setTool(id);
        setArticleId(null);
        setDocId(null);
        const next = `#tool-${id}`;
        if (window.location.hash !== next) {
          if (scroll) window.location.hash = next;
          else window.history.replaceState(null, "", next);
        }
        if (scroll) document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" });
      },
      articleId,
      openArticle: (id) => {
        window.location.hash = `article-${id}`;
      },
      docId,
      openDoc: (id) => {
        window.location.hash = `doc-${id}`;
      },
      closeOverlay: () => {
        const returnTo = docId ? "#more" : "#articles";
        window.location.hash = returnTo;
      },
      progress,
      loggedToday: loggedOn(progress),
      setName: (name) => setProgress((current) => ({ ...current, name: name.slice(0, 24) })),
      logAction: (id) => {
        const action = ACTIONS.find((item) => item.id === id);
        const result = applyAction(progress, id);
        setProgress(result.progress);
        if (result.added && action) {
          setToastState(`✨ +${action.points} pts: "${action.label}" logged!`);
        } else {
          setToastState(`Already logged today! Good job staying consistent.`);
        }
        return result.added;
      },
      toggleChallenge: () =>
        setProgress((current) => {
          const nextState = !current.joinedChallenge;
          setToastState(nextState ? "🎯 Joined this week's 20-min mindful challenge!" : "Challenge unjoined");
          return { ...current, joinedChallenge: nextState };
        }),
      togglePledge: () =>
        setProgress((current) => {
          const next = current.pledgedAt ? null : new Date().toISOString();
          setToastState(next ? "❤️ Pledge taken! Saved on your device." : "Pledge reset");
          return { ...current, pledgedAt: next };
        }),
      resetProgress: () => {
        setProgress(freshProgress());
        setToastState("On-device score & habits reset.");
      },
      importProgress: (imported: Progress) => {
        setProgress(imported);
        setToastState(`✅ Habits & points successfully restored! (${imported.points.toLocaleString()} pts)`);
      },
      toast,
      setToast: setToastState,
      model,
      setModel: (patch) => setModelState((current) => ({ ...current, ...patch })),
    };
  }, [tool, articleId, docId, progress, model, toast]);

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error("Rep Trackers store is missing.");
  return store;
}
