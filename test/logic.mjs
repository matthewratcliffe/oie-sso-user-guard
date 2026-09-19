/*
 * The pure helpers out of webadmin/web/plugin.js, so they can be tested without
 * a browser DOM. This plugin has no Java: everything it does is in plugin.js.
 *
 * Copied rather than imported, the same arrangement the Backup / Git Sync /
 * Volume Monitor extensions use: plugin.js is a DOM-driven module the console
 * loads, and importing it here would try to run its MutationObserver setup.
 * asArray and the EDIT_USER_TITLE regex are lifted verbatim; isSsoBinding is
 * the inline `props.some(...)` predicate from isSsoBound(), extracted to a named
 * function so the one bit of real decision logic can be tested on its own.
 */

// The dialog title matcher, copied verbatim.
export const EDIT_USER_TITLE = /^Edit User\b/;

// The user preference the OIDC extension writes when it binds an account.
export const SSO_PREFERENCE = 'oidc.subject';

/*
 * Engine responses come through XStream, so a one-element list is not a list:
 *   {"list":{"user":[{...},{...}]}}   two users
 *   {"list":{"user":{...}}}           one user
 *   {"list":null} / {"list":""}       none
 * Normalise all of them to an array.
 */
export function asArray(value) {
    if (value == null || value === '') return [];
    return Array.isArray(value) ? value : [value];
}

/*
 * The binding test from isSsoBound()'s props.some() callback: a bound account
 * carries oidc.subject with a non-blank value. An empty one is not a binding.
 */
export function isSsoBinding(p) {
    return !!(p && p['@name'] === SSO_PREFERENCE && String(p.$ || '').trim() !== '');
}
