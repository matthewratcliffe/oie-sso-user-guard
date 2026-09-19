import { test } from 'node:test';
import assert from 'node:assert/strict';
import { asArray, isSsoBinding, EDIT_USER_TITLE } from './logic.mjs';

test('asArray normalises XStream one-or-many shapes', () => {
    assert.deepEqual(asArray(null), []);
    assert.deepEqual(asArray(undefined), []);
    assert.deepEqual(asArray(''), []);              // XStream empty list
    assert.deepEqual(asArray({ a: 1 }), [{ a: 1 }]); // lone object wrapped
    assert.deepEqual(asArray([{ a: 1 }, { b: 2 }]), [{ a: 1 }, { b: 2 }]); // array passthrough
    // Falsy-but-present values are values, not "empty".
    assert.deepEqual(asArray(0), [0]);
    assert.deepEqual(asArray(false), [false]);
    // Whitespace is not the empty string, so it survives.
    assert.deepEqual(asArray('   '), ['   ']);
});

test('EDIT_USER_TITLE matches the Edit User dialog only', () => {
    assert.equal(EDIT_USER_TITLE.test('Edit User'), true);
    assert.equal(EDIT_USER_TITLE.test('Edit User — jdoe'), true);   // username after
    assert.equal(EDIT_USER_TITLE.test('Edit Users'), false);        // \b stops "Users"
    assert.equal(EDIT_USER_TITLE.test('Add User'), false);
    assert.equal(EDIT_USER_TITLE.test(' Edit User'), false);        // ^ anchors
});

test('isSsoBinding is true only for a non-blank oidc.subject preference', () => {
    assert.equal(isSsoBinding({ '@name': 'oidc.subject', $: 'https://issuer/#sub' }), true);
    assert.equal(isSsoBinding({ '@name': 'oidc.subject', $: '' }), false);   // empty value
    assert.equal(isSsoBinding({ '@name': 'oidc.subject', $: '   ' }), false); // trims to empty
    assert.equal(isSsoBinding({ '@name': 'oidc.subject' }), false);          // no value
    assert.equal(isSsoBinding({ '@name': 'other', $: 'x' }), false);         // wrong pref
    assert.equal(isSsoBinding(null), false);
});
