/**
 * Structured logger utility conforming to Kent Beck and Clean Architecture observability standards.
 * Provides explicit step logging, decision tracing, and step conclusion notifications.
 */
export class Logger {
  private readonly context: string;

  /**
   * Initializes a new Logger instance bound to a specific component or service context.
   *
   * @param context - Name of the domain module or service executing the routine.
   */
  constructor(context: string) {
    this.context = context;
  }

  /**
   * Logs the initiation of a distinct workflow step with associated metadata.
   *
   * @param stepName - Descriptive name of the starting operation.
   * @param metadata - Contextual key-value pairs relevant to the step.
   */
  public logStepStart(stepName: string, metadata?: Record<string, unknown>): void {
    console.debug(`[${this.context}] Step started: ${stepName}`, metadata ? JSON.stringify(metadata) : '');
  }

  /**
   * Logs a deliberate branching decision, fallback invocation, or validation rejection.
   * Critical for tracking why a particular code path was selected at runtime.
   *
   * @param decision - Summary of the decision evaluated.
   * @param reason - Architectural, operational, or business reason justifying the outcome.
   */
  public logDecision(decision: string, reason: string): void {
    console.info(`[${this.context}] Decision taken: ${decision}. Reason: ${reason}`);
  }

  /**
   * Logs the successful or handled conclusion of a workflow step.
   *
   * @param stepName - Descriptive name of the finalized operation.
   * @param resultSummary - Brief outcome summary.
   */
  public logStepConclusion(stepName: string, resultSummary: string): void {
    console.debug(`[${this.context}] Step concluded: ${stepName}. Outcome: ${resultSummary}`);
  }

  /**
   * Logs exceptional conditions encountered during execution.
   *
   * @param message - Diagnostic message describing the failure.
   * @param error - The underlying error instance if available.
   */
  public logError(message: string, error?: unknown): void {
    console.error(`[${this.context}] Error: ${message}`, error);
  }
}
