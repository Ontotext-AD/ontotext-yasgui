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

  describe('trailing VALUES variable scoping', () => {
    const prefix = 'PREFIX : <http://example.com/>\n';

    it('rejects a SELECT alias that reuses a trailing VALUES variable', () => {
      const result = checkQuerySyntax(CodeMirror, prefix + 'SELECT (1 AS ?c) WHERE { ?s :p ?o } VALUES ?c { 1 }');
      expect(result.valid).toBe(false);
      expect(result.diagnostic).toEqual({
        messageLabelKey: 'yasqe.check_syntax.error.select_alias_in_values_scope',
        parameters: [{key: 'alias', value: '?c'}]
      });
    });

    it('still requires a variable bound by a VALUES block inside WHERE to be grouped', () => {
      const result = checkQuerySyntax(CodeMirror, prefix + 'SELECT ?s ?v WHERE { ?s :p ?o VALUES ?v { 1 } } GROUP BY ?s');
      expect(result.valid).toBe(false);
      expect(result.diagnostic).toEqual({
        messageLabelKey: 'yasqe.check_syntax.error.select_variable_not_in_group_by',
        parameters: [{key: 'variable', value: '?v'}]
      });
    });

    it.each([
      ['in the projection of a grouped query', 'SELECT ?s ?v WHERE { ?s :p ?o } GROUP BY ?s VALUES ?v { 1 }'],
      ['in a select expression of a grouped query', 'SELECT ?s (?v + 1 AS ?w) WHERE { ?s :p ?o } GROUP BY ?s VALUES (?v ?u) { (1 2) }'],
      ['next to an aggregate without GROUP BY', 'SELECT ?v (COUNT(*) AS ?c) WHERE { ?s :p ?o } VALUES ?v { 1 }']
    ])('accepts a trailing VALUES variable %s', (_, query) => {
      expect(checkQuerySyntax(CodeMirror, prefix + query).valid).toBe(true);
    });

    it('does not let a sub-SELECT trailing VALUES variable satisfy the outer GROUP BY', () => {
      const result = checkQuerySyntax(CodeMirror, prefix + 'SELECT ?s ?v WHERE { { SELECT ?s { ?s :p ?o } VALUES ?v { 1 } } } GROUP BY ?s');
      expect(result.valid).toBe(false);
      expect(result.diagnostic).toEqual({
        messageLabelKey: 'yasqe.check_syntax.error.select_variable_not_in_group_by',
        parameters: [{key: 'variable', value: '?v'}]
      });
    });
  });

  describe('BINDINGS, the SPARQL 1.1 draft form of the trailing VALUES clause', () => {
    const prefix = 'PREFIX : <http://example.com/>\n';

    it.each([
      ['a single variable', 'SELECT * WHERE { ?s :p ?o } BINDINGS ?s { (:a) (:b) }'],
      ['several variables', 'SELECT * WHERE { ?s :p ?o } BINDINGS ?s ?o { (:a 30) (:b 99) }'],
      ['UNDEF values', 'SELECT * WHERE { ?s :p ?o } BINDINGS ?s ?o { (:a UNDEF) (UNDEF 25) }'],
      ['a lowercase keyword', 'SELECT * WHERE { ?s :p ?o } bindings ?s { (:a) }'],
      ['literal values', 'SELECT * WHERE { ?s :p ?o } BINDINGS ?o { ("a"@en) ("b"^^:t) (25.0) (true) }'],
      ['no variables and an empty row', 'SELECT * WHERE { ?s :p ?o } BINDINGS { () }'],
      ['no rows', 'SELECT * WHERE { ?s :p ?o } BINDINGS ?s { }'],
      ['solution modifiers before it', 'SELECT * WHERE { ?s :p ?o } ORDER BY DESC(?o) LIMIT 1 BINDINGS ?s { (:a) }'],
      ['a GROUP BY before it', 'SELECT ?s (COUNT(?o) AS ?c) WHERE { ?s :p ?o } GROUP BY ?s BINDINGS ?s { (:a) }'],
      ['an ASK query', 'ASK { ?s :p ?o } BINDINGS ?s { (:a) }'],
      ['a CONSTRUCT query', 'CONSTRUCT { ?s :q ?o } WHERE { ?s :p ?o } BINDINGS ?s { (:a) }'],
      ['a DESCRIBE query', 'DESCRIBE ?s WHERE { ?s :p ?o } BINDINGS ?s { (:a) }'],
      ['an inline VALUES block in WHERE', 'SELECT * WHERE { VALUES ?s { :a :b } ?s :p ?o } BINDINGS ?s { (:b) }'],
      ['a sub-SELECT', 'SELECT * WHERE { { SELECT ?s WHERE { ?s :p ?o } BINDINGS ?s { (:a) } } }'],
      ['a triple term value', 'SELECT * WHERE { ?s :p ?o } BINDINGS ?t { (<<( :a :p :b )>>) }'],
      ['the query from GDB-15166', 'PREFIX skos: <http://www.w3.org/2004/02/skos/core#>\nBASE <http://example.org/>\nSELECT *\nWHERE\n{\n    ?entity <predicate#hasId> ?id\n    OPTIONAL { ?entity <predicate#hasId2> ?id2 . }\n    BIND( COALESCE(?id2, ?id) AS ?entityId)\n    ?entity <predicate#hasBlankNode> [<predicate#hasBlankNodeValue> [skos:prefLabel ?status]] .\n}\nBINDINGS ?entity {\n  ( <entity1> )\n}']
    ])('accepts %s', (_, query) => {
      expect(checkQuerySyntax(CodeMirror, prefix + query).valid).toBe(true);
    });

    it('accepts bindings as a prefix and a variable name', () => {
      expect(checkQuerySyntax(CodeMirror, 'PREFIX bindings: <http://example.com/>\nSELECT ?bindings WHERE { ?bindings bindings:p ?o }').valid).toBe(true);
    });

    it('scopes its variables like a trailing VALUES clause', () => {
      expect(checkQuerySyntax(CodeMirror, prefix + 'SELECT ?s ?v WHERE { ?s :p ?o } GROUP BY ?s BINDINGS ?v { (1) }').valid).toBe(true);
    });

    it.each([
      ['inside WHERE', 'SELECT * WHERE { ?s :p ?o BINDINGS ?s { (:a) } }'],
      ['with parenthesized variables', 'SELECT * WHERE { ?s :p ?o } BINDINGS (?s) { (:a) }'],
      ['with a row without parentheses', 'SELECT * WHERE { ?s :p ?o } BINDINGS ?s { :a :b }'],
      ['with a variable as a value', 'SELECT * WHERE { ?s :p ?o } BINDINGS ?s { (?o) }'],
      ['before ORDER BY', 'SELECT * WHERE { ?s :p ?o } BINDINGS ?s { (:a) } ORDER BY ?s'],
      ['after a trailing VALUES clause', 'SELECT * WHERE { ?s :p ?o } VALUES ?s { :a } BINDINGS ?s { (:a) }'],
      ['in an update', 'INSERT { ?s :q true } WHERE { ?s :p ?o } BINDINGS ?s { (:a) }']
    ])('rejects BINDINGS %s', (_, query) => {
      expect(checkQuerySyntax(CodeMirror, prefix + query).valid).toBe(false);
    });

    it.each([
      ['fewer values than variables', 'SELECT * { } BINDINGS ?x ?y { (1 2) (3) }', '1', '2'],
      ['more values than variables', 'SELECT * { } BINDINGS ?x { (1 2) }', '2', '1'],
      ['a value without variables', 'SELECT * { } BINDINGS { (1) }', '1', '0']
    ])('rejects a row with %s', (_, query, valueCount, variableCount) => {
      const result = checkQuerySyntax(CodeMirror, query);
      expect(result.valid).toBe(false);
      expect(result.diagnostic).toEqual({
        messageLabelKey: 'yasqe.check_syntax.error.values_arity_mismatch',
        parameters: [{key: 'valueCount', value: valueCount}, {key: 'variableCount', value: variableCount}]
      });
    });

    it('rejects an empty row when variables are declared', () => {
      const result = checkQuerySyntax(CodeMirror, 'SELECT * { } BINDINGS ?x { () }');
      expect(result.valid).toBe(false);
      expect(result.diagnostic).toEqual({
        messageLabelKey: 'yasqe.check_syntax.error.values_nil_arity_mismatch',
        parameters: [{key: 'variableCount', value: '1'}]
      });
    });

    it('rejects a duplicate variable like VALUES does', () => {
      const result = checkQuerySyntax(CodeMirror, 'SELECT * { } BINDINGS ?x ?x { (1 2) }');
      expect(result.valid).toBe(false);
      expect(result.diagnostic).toEqual({
        messageLabelKey: 'yasqe.check_syntax.error.duplicate_values_variable',
        parameters: [{key: 'variable', value: '?x'}]
      });
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
      'yasqe.check_syntax.error.select_alias_in_values_scope',
      'yasqe.check_syntax.error.select_star_variable_not_in_group_by',
      'yasqe.check_syntax.error.select_variable_not_in_group_by',
      'yasqe.check_syntax.error.values_arity_mismatch',
      'yasqe.check_syntax.error.values_nil_arity_mismatch'
    ]);
    expect(syntaxKeys('locale-fr.json')).toEqual(syntaxKeys('locale-en.json'));
  });
});
