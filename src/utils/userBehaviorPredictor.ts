import * as tf from '@tensorflow/tfjs';
import { ElMessage } from 'element-plus';

interface UserAction {
  action: string;
  timestamp: number;
  hour: number;
  dayOfWeek: number;
}

class UserBehaviorPredictor {
  private model: tf.Sequential;
  private actions: UserAction[] = [];
  private actionTypes: Set<string> = new Set();
  private readonly maxActions = 1000;

  constructor() {
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ units: 8, activation: 'relu', inputShape: [2] }),
        tf.layers.dense({ units: 4, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' })
      ]
    });

    this.model.compile({
      optimizer: tf.train.adam(0.01),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });
  }

  // 记录用户操作
  public recordAction(action: string): void {
    const now = new Date();
    const newAction: UserAction = {
      action,
      timestamp: now.getTime(),
      hour: now.getHours(),
      dayOfWeek: now.getDay()
    };

    this.actions.push(newAction);
    this.actionTypes.add(action);

    if (this.actions.length > this.maxActions) {
      this.actions.shift();
    }

    // 每记录10个操作就重新训练一次
    if (this.actions.length % 10 === 0) {
      this.train();
    }
  }

  // 训练模型
  private async train(): Promise<void> {
    if (this.actions.length < 20) return;

    const inputData = this.actions.map(action => [
      action.hour / 24,
      action.dayOfWeek / 7
    ]);

    const outputData = this.actions.map(action => 
      Array.from(this.actionTypes).indexOf(action.action)
    );

    const xs = tf.tensor2d(inputData);
    const ys = tf.oneHot(tf.tensor1d(outputData, 'int32'), this.actionTypes.size);

    try {
      await this.model.fit(xs, ys, {
        epochs: 50,
        batchSize: 32,
        shuffle: true,
        verbose: 0
      });

      // 清理内存
      xs.dispose();
      ys.dispose();
    } catch (error) {
      console.error('训练模型失败:', error);
    }
  }

  // 预测下一个最可能的操作
  public async predictNextAction(currentHour: number, currentDay: number): Promise<string> {
    if (this.actions.length < 20 || this.actionTypes.size === 0) {
      return '';
    }

    try {
      const input = tf.tensor2d([[currentHour / 24, currentDay / 7]]);
      const prediction = this.model.predict(input) as tf.Tensor;
      const actionIndex = await prediction.argMax(1).data();
      
      // 清理内存
      input.dispose();
      prediction.dispose();

      return Array.from(this.actionTypes)[actionIndex[0]] || '';
    } catch (error) {
      console.error('预测失败:', error);
      return '';
    }
  }

  // 获取用户行为模式分析
  public getPatternAnalysis(): string[] {
    if (this.actions.length === 0) {
      return ['开始使用后，这里将显示您的使用习惯分析'];
    }

    const patterns: string[] = [];
    
    // 分析最常用的操作时间
    const hourMap = new Map<number, number>();
    this.actions.forEach(action => {
      hourMap.set(action.hour, (hourMap.get(action.hour) || 0) + 1);
    });

    const sortedHours = Array.from(hourMap.entries())
      .sort(([, a], [, b]) => b - a);

    if (sortedHours.length > 0) {
      const [mostActiveHour, count] = sortedHours[0];
      const percentage = Math.round((count / this.actions.length) * 100);
      patterns.push(
        `您最活跃的时间是 ${mostActiveHour}:00，占总操作的 ${percentage}%`
      );
    }

    // 分析最频繁的操作
    const actionMap = new Map<string, number>();
    this.actions.forEach(action => {
      actionMap.set(action.action, (actionMap.get(action.action) || 0) + 1);
    });

    const sortedActions = Array.from(actionMap.entries())
      .sort(([, a], [, b]) => b - a);

    if (sortedActions.length > 0) {
      const [mostFrequentAction, count] = sortedActions[0];
      const percentage = Math.round((count / this.actions.length) * 100);
      patterns.push(
        `您最常执行的操作是"${mostFrequentAction}"，占总操作的 ${percentage}%`
      );
    }

    // 添加当前时间段的使用建议
    const now = new Date();
    const currentHour = now.getHours();
    const currentActions = this.actions.filter(a => a.hour === currentHour);
    
    if (currentActions.length > 0) {
      const currentActionMap = new Map<string, number>();
      currentActions.forEach(action => {
        currentActionMap.set(action.action, (currentActionMap.get(action.action) || 0) + 1);
      });

      const [mostFrequentCurrentAction] = Array.from(currentActionMap.entries())
        .sort(([, a], [, b]) => b - a)[0];

      patterns.push(
        `在 ${currentHour}:00 这个时间段，您通常会${mostFrequentCurrentAction}`
      );
    }

    return patterns;
  }

  // 检测异常操作
  public detectAbnormalBehavior(action: string): boolean {
    const now = new Date();
    const currentHour = now.getHours();
    
    // 检查是否是用户常用时间
    const hourCount = this.actions.filter(a => a.hour === currentHour).length;
    const isUnusualTime = hourCount < this.actions.length * 0.1;

    // 检查操作频率
    const recentActions = this.actions.filter(a => 
      now.getTime() - a.timestamp < 5 * 60 * 1000 && a.action === action
    );
    const isFrequent = recentActions.length > 5;

    if (isUnusualTime && isFrequent) {
      ElMessage.warning('检测到异常操作模式，请注意操作安全');
      return true;
    }

    return false;
  }
}

export const behaviorPredictor = new UserBehaviorPredictor();
