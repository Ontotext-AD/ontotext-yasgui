export class ExplainPlanUtil {
  private static readonly marker = '# NOTE: Optimization groups';

  private static isExplainResponse(binding: any): boolean {
    return (
      binding?.type === 'literal' &&
      typeof binding?.value === 'string' &&
      binding.value.includes(ExplainPlanUtil.marker)
    );
  }

  private static getExplainBinding(results?: any): any | undefined {
    if (!results) {
      return undefined;
    }

    const bindings = results.getBindings?.();
    if (!bindings || bindings.length === 0) {
      return undefined;
    }

    const firstRow = bindings[0] as Record<string, any>;
    if (firstRow?.plan) {
      return firstRow.plan;
    }

    for (const row of bindings as Array<Record<string, any>>) {
      for (const key of Object.keys(row)) {
        const cell = row[key];
        if (
          cell?.type === 'literal' &&
          typeof cell.value === 'string' &&
          cell.value.includes(ExplainPlanUtil.marker)
        ) {
          return cell;
        }
      }
    }

    return undefined;
  }

  public static isExplainResults(results?: any): boolean {
    const explainBinding = ExplainPlanUtil.getExplainBinding(results);
    return !!(explainBinding && ExplainPlanUtil.isExplainResponse(explainBinding));
  }
}
