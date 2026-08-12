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
