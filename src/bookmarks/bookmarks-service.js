const BookmarksService = {
  getAllBookmarks(db) {
    return db
      .select('*')
      .from('bookmarks');
  },
  insertBookmark(db, newBookmark) {
    return db
      .insert(newBookmark)
      .into('bookmarks')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },
  getById(db, id) {
    return db
      .select('*')
      .from('bookmarks')
      .where({ id: id })
      .first();
  },
  deleteBookmark(db, id) {
    return db
      .from('bookmarks')
      .where({ id })
      .delete();
  },
  updateBookmark(db, id, newData) {
    return db
      .from('bookmarks')
      .where({ id })
      .update(newData);
  }
};
  
module.exports = BookmarksService;