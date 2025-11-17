type TaskQueueType<T> = () => Promise<T>;

interface TaskQueueManagerArgs {
  maxConcurrent?: number;
  onTaskStart?: (taskId: number) => void;
  onTaskComplete?: (taskId: number, result: any) => void;
  onTaskError?: (taskId: number, error: any) => void;
}

interface QueuedTask<T> {
  id: number;
  task: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (reason?: any) => void;
}

class TaskQueueManager {
  private maxConcurrent: number;
  private activeCount: number = 0;
  private taskQueue: Array<QueuedTask<any>> = [];
  private taskIdCounter: number = 0;
  private onTaskStart?: (taskId: number) => void;
  private onTaskComplete?: (taskId: number, result: any) => void;
  private onTaskError?: (taskId: number, error: any) => void;

  constructor({
    maxConcurrent = 3,
    onTaskStart,
    onTaskComplete,
    onTaskError,
  }: TaskQueueManagerArgs = {}) {
    this.maxConcurrent = maxConcurrent;
    this.onTaskStart = onTaskStart;
    this.onTaskComplete = onTaskComplete;
    this.onTaskError = onTaskError;
  }

  /**
   * 将任务加入队列
   * @param task 要执行的任务函数
   * @returns Promise，在任务完成时 resolve
   */
  public enqueue<T>(task: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const taskId = ++this.taskIdCounter;
      const queuedTask: QueuedTask<T> = {
        id: taskId,
        task,
        resolve,
        reject,
      };

      if (this.activeCount < this.maxConcurrent) {
        this.activeCount++;
        this.runTask(queuedTask);
      } else {
        console.log("任务排队，当前队列长度:", this.taskQueue.length + 1);
        this.taskQueue.push(queuedTask);
      }
    });
  }

  /**
   * 执行任务
   */
  private async runTask<T>(queuedTask: QueuedTask<T>): Promise<void> {
    const { id, task, resolve, reject } = queuedTask;

    try {
      this.onTaskStart?.(id);
      const result = await task();
      this.onTaskComplete?.(id, result);
      resolve(result);
    } catch (error) {
      this.onTaskError?.(id, error);
      reject(error);
    } finally {
      this.activeCount--;
      this.processNext();
    }
  }

  /**
   * 处理队列中的下一个任务
   */
  private processNext(): void {
    if (this.taskQueue.length > 0 && this.activeCount < this.maxConcurrent) {
      const nextTask = this.taskQueue.shift();
      if (nextTask) {
        this.activeCount++;
        this.runTask(nextTask);
      }
    }
  }

  /**
   * 获取当前状态
   */
  public getStatus() {
    return {
      activeCount: this.activeCount,
      queuedCount: this.taskQueue.length,
      maxConcurrent: this.maxConcurrent,
    };
  }

  /**
   * 清空队列（不影响正在执行的任务）
   */
  public clear(): void {
    this.taskQueue.forEach((task) => {
      task.reject(new Error("Task cancelled: Queue cleared"));
    });
    this.taskQueue = [];
  }

  /**
   * 更新最大并发数
   */
  public setMaxConcurrent(maxConcurrent: number): void {
    this.maxConcurrent = maxConcurrent;
    // 如果新的并发数更大，尝试处理更多任务
    while (this.activeCount < this.maxConcurrent && this.taskQueue.length > 0) {
      this.processNext();
    }
  }

  /**
   * 等待所有任务完成
   */
  public async waitForAll(): Promise<void> {
    while (this.activeCount > 0 || this.taskQueue.length > 0) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
}

export { TaskQueueManager, type TaskQueueType, type TaskQueueManagerArgs };
