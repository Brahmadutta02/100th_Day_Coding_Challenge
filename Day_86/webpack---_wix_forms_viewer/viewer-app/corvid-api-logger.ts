class CorvidApiLogger {
  private static logTitle = 'Wix Forms'

  private static _log(method: (msg: string) => void, msg: string, stacktrace?: string) {
    const errorTitle = `${CorvidApiLogger.logTitle}: ${msg}`

    if (stacktrace) {
      method(`${errorTitle}\nstacktrace:\n${stacktrace}`)
    } else {
      method(errorTitle)
    }
  }

  public static i(msg: string) {
    this._log(console.log, msg)
  }

  public static e(msg: string, stacktrace?: string) {
    this._log(console.error, msg, stacktrace)
  }

  public static w(msg: string, stacktrace?: string) {
    this._log(console.warn, msg, stacktrace)
  }
}

export default CorvidApiLogger
