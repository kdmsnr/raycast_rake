import {
  Action,
  ActionPanel,
  List,
  Toast,
  showToast,
} from "@raycast/api";
import { execFile } from "node:child_process";
import { homedir } from "node:os";
import { promisify } from "node:util";
import { useEffect, useState } from "react";

const execFileAsync = promisify(execFile);

type RakeTask = {
  name: string;
  description: string;
};

async function rake(...args: string[]) {
  return execFileAsync(
    "/bin/zsh",
    ["-l", "-c", `rake ${args.map(shellescape).join(" ")}`],
    {
      cwd: homedir(),
      encoding: "utf8",
    },
  );
}

function shellescape(s: string) {
  return `'${s.replace(/'/g, `'\\''`)}'`;
}

export default function Command() {
  const [tasks, setTasks] = useState<RakeTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    setIsLoading(true);

    try {
      const { stdout } = await rake("-T");

      const tasks = stdout
        .split("\n")
        .map((line): RakeTask | null => {
          const match = line.match(/^rake\s+(\S+)(?:\s+#\s*(.*))?$/);

          if (!match) {
            return null;
          }

          return {
            name: match[1],
            description: match[2] ?? "",
          };
        })
        .filter((task): task is RakeTask => task !== null);

      setTasks(tasks);
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "rake -T failed",
        message: String(error),
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function runTask(task: RakeTask) {
    const toast = await showToast({
      style: Toast.Style.Animated,
      title: `rake ${task.name}`,
    });

    try {
      const { stdout, stderr } = await rake(task.name);

      toast.style = Toast.Style.Success;
      toast.title = `rake ${task.name}`;
      toast.message = stdout.trim() || stderr.trim() || "Done";
    } catch (error) {
      toast.style = Toast.Style.Failure;
      toast.title = `rake ${task.name} failed`;
      toast.message = String(error);
    }
  }

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder="Search rake tasks..."
    >
      {tasks.map((task) => (
        <List.Item
          key={task.name}
          title={task.name}
          subtitle={task.description}
          actions={
            <ActionPanel>
              <Action
                title="Run Rake Task"
                onAction={() => runTask(task)}
              />
              <Action
                title="Reload Tasks"
                shortcut={{ modifiers: ["cmd"], key: "r" }}
                onAction={loadTasks}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
