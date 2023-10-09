/** The oomph db
 *
 * @category database
 */
export interface oomph_db {
  dbName: string;
  oramaDb: any;
  schema: object;

  list(): string;
  save(): string;
  read(id: string): string;
  update(): string;
  delete(): string;
  delete_all(): string;
}
