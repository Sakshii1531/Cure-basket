import { useAuth } from '../context/AuthContext'

/**
 * useAuthGate — wraps any action with an auth check.
 * If the user is logged in, executes immediately.
 * If not, saves the intent and opens the login modal.
 * After login, the intent executes automatically via AuthContext.
 */
export function useAuthGate() {
  const { isLoggedIn, requireAuth } = useAuth()

  /**
   * guardedAction(fn, intentLabel)
   * Returns a function that runs fn() only if authenticated.
   * @param {Function} fn — the action to guard
   * @param {string} [label] — optional label for debugging
   */
  const guardedAction = (fn, label = 'action') => {
    return (...args) => {
      const allowed = requireAuth({ fn, args, label })
      if (allowed) {
        fn(...args)
      }
    }
  }

  return { guardedAction, isLoggedIn }
}
