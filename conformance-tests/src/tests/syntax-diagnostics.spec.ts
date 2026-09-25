/**
 * @jest-environment jsdom
 */
import {checkQuerySyntax, CodeMirrorInstance, initGrammar} from '../syntax-check-utils';
import * as fs from 'fs';
import * as path from 'path';

let CodeMirror: CodeMirrorInstance;

beforeAll(() => {
  CodeMirror = initGrammar();
}, 60_000);

describe('YASQE syntax diagnostics', () => {
  it('reports an undefined prefix with its translation key and parameter', () => {
    const result = checkQuerySyntax(CodeMirror, 'SELECT * WHERE { ?s missing:value ?o }');
    expect(result.valid).toBe(false);
    expect(result.diagnostic).toEqual({
      messageLabelKey: 'yasqe.check_syntax.error.prefix_not_defined',
      parameters: [{key: 'prefix', value: 'missing'}]
    });
  });

  it('reports a nested aggregate with its static translation key', () => {
    const result = checkQuerySyntax(CodeMirror, 'SELECT (COUNT(SUM(?value)) AS ?count) WHERE { ?s ?p ?value }');

    expect(result.valid).toBe(false);
    expect(result.diagnostic).toEqual({
      messageLabelKey: 'yasqe.check_syntax.error.nested_aggregate'
    });
  });

  describe('reifiers and annotations after property paths', () => {
    const prefix = 'PREFIX : <http://example.com/>\n';

    it.each([
      ['a reified triple after a sequence path in a previous triple', 'SELECT * WHERE { ?x :a/:b ?y . << :s :p :o ~:r >> :q ?z }'],
      ['a nested reified triple after an alternative path', 'SELECT * WHERE { ?x :a|:b ?y . << << ?h :p ?s ~?own >> :q ?pl ~?acc >> :r ?e }'],
      ['a reified triple as the object of an inverse path', 'SELECT * WHERE { ?x ^:a << :s :p :o ~:r >> }'],
      ['a reifier after a simple predicate that follows a path in an annotation block', 'SELECT * WHERE { ?x :p ?y {| :q/:r ?z |} ~:t }'],
      ['an annotation block after a simple predicate that follows a path in an annotation block', 'SELECT * WHERE { ?x :p ?y {| :q/:r ?z |} {| :a :b |} }']
    ])('accepts %s', (_, query) => {
      expect(checkQuerySyntax(CodeMirror, prefix + query).valid).toBe(true);
    });

    it.each([
      ['a reifier', 'SELECT * WHERE { ?x :a/:b ?y ~:r }', 'yasqe.check_syntax.error.annotation_or_reifier_after_property_path'],
      ['a reifier after a reified triple object', 'SELECT * WHERE { ?x :a/:b << :s :p :o ~:r >> ~:t }', 'yasqe.check_syntax.error.annotation_or_reifier_after_property_path'],
      ['an annotation block', 'SELECT * WHERE { ?x :a/:b ?y {| :c :d |} }', 'yasqe.check_syntax.error.annotation_after_property_path'],
      ['a reifier inside an annotation block', 'SELECT * WHERE { ?x :p ?y {| :q/:r ?z ~:t |} }', 'yasqe.check_syntax.error.annotation_or_reifier_after_property_path']
    ])('rejects %s directly after a property path', (_, query, messageLabelKey) => {
      const result = checkQuerySyntax(CodeMirror, prefix + query);
      expect(result.valid).toBe(false);
      expect(result.diagnostic).toEqual({messageLabelKey});
    });
  });

  describe('reifiers and annotations where blank nodes are disallowed', () => {
    const prefix = 'PREFIX : <http://example.com/>\n';

    it.each([
      ['a named reifier with an annotation block', 'DELETE DATA { :s :p :o ~:r {| :a :b |} }'],
      ['a reified triple with a named reifier', 'DELETE DATA { << :s :p :o ~:r >> :q :z }'],
      ['an anonymous annotation block in INSERT DATA', 'INSERT DATA { :s :p :o {| :a :b |} }'],
      ['a reifier without an identifier in INSERT DATA', 'INSERT DATA { :s :p :o ~ {| :a :b |} }'],
      ['a reified triple without a reifier in INSERT DATA', 'INSERT DATA { << :s :p :o >> :q :z }']
    ])('accepts %s', (_, query) => {
      expect(checkQuerySyntax(CodeMirror, prefix + query).valid).toBe(true);
    });

    it.each([
      ['an anonymous annotation block after a nested annotation block that ends with a reifier', 'DELETE DATA { :s :p :o ~:r {| :a :b ~:r2 |} {| :c :d |} }', 'yasqe.check_syntax.error.anonymous_annotation_disallowed'],
      ['the same in DELETE WHERE', 'DELETE WHERE { :s :p :o ~:r {| :a :b ~:r2 |} {| :c :d |} }', 'yasqe.check_syntax.error.anonymous_annotation_disallowed'],
      ['a reifier without an identifier', 'DELETE DATA { :s :p :o ~ }', 'yasqe.check_syntax.error.anonymous_reifier_disallowed'],
      ['a reifier without an identifier before an annotation block', 'DELETE DATA { :s :p :o ~ {| :a :b |} }', 'yasqe.check_syntax.error.anonymous_reifier_disallowed'],
      ['a reified triple without a reifier', 'DELETE DATA { << :s :p :o >> :q :z }', 'yasqe.check_syntax.error.anonymous_reifier_disallowed'],
      ['a reified triple with a reifier without an identifier', 'DELETE WHERE { << ?s ?p ?o ~ >> :q ?z }', 'yasqe.check_syntax.error.anonymous_reifier_disallowed']
    ])('rejects %s', (_, query, messageLabelKey) => {
      const result = checkQuerySyntax(CodeMirror, prefix + query);
      expect(result.valid).toBe(false);
      expect(result.diagnostic).toEqual({messageLabelKey});
    });
  });

  it('keeps English and French syntax diagnostic catalogs in sync', () => {
    const localeDirectory = path.resolve(__dirname, '../../../ontotext-yasgui-web-component/src/i18n');
    const syntaxKeys = (locale: string) => Object.keys(JSON.parse(fs.readFileSync(
      path.join(localeDirectory, locale),
      'utf8'
    ))).filter((key) => key.startsWith('yasqe.check_syntax.error.')).sort();

    expect(syntaxKeys('locale-en.json')).toEqual([
      'yasqe.check_syntax.error.annotation_after_property_path',
      'yasqe.check_syntax.error.annotation_or_reifier_after_property_path',
      'yasqe.check_syntax.error.anonymous_annotation_disallowed',
      'yasqe.check_syntax.error.anonymous_reifier_disallowed',
      'yasqe.check_syntax.error.bind_variable_already_in_scope',
      'yasqe.check_syntax.error.blank_node_label_across_group_boundaries',
      'yasqe.check_syntax.error.duplicate_select_alias',
      'yasqe.check_syntax.error.duplicate_values_variable',
      'yasqe.check_syntax.error.invalid_base_direction',
      'yasqe.check_syntax.error.invalid_line.prefix',
      'yasqe.check_syntax.error.invalid_numeric_escape',
      'yasqe.check_syntax.error.nested_aggregate',
      'yasqe.check_syntax.error.prefix_not_defined',
      'yasqe.check_syntax.error.select_aggregate_variable_without_group_by',
      'yasqe.check_syntax.error.select_alias_conflicts_subselect_variable',
      'yasqe.check_syntax.error.select_alias_in_group_by_scope',
      'yasqe.check_syntax.error.select_star_variable_not_in_group_by',
      'yasqe.check_syntax.error.select_variable_not_in_group_by',
      'yasqe.check_syntax.error.values_arity_mismatch',
      'yasqe.check_syntax.error.values_nil_arity_mismatch'
    ]);
    expect(syntaxKeys('locale-fr.json')).toEqual(syntaxKeys('locale-en.json'));
  });
});
