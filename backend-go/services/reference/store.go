package reference

import (
	"database/sql"

	"github.com/riyavij2001/TrackMyStock/types"
	"github.com/riyavij2001/TrackMyStock/utils"
)

type Store struct {
	db *sql.DB
}

func NewStore(db *sql.DB) *Store {
	return &Store{db: db}
}

func (s *Store) GetAllReferences() ([]types.Reference, error) {
	query := `SELECT id, display_val, value FROM reference`
	rows, err := s.db.Query(query)
	if err != nil {
		utils.LogMessage(utils.ERROR, "Error querying references:", err)
		return nil, err
	}
	defer rows.Close()

	var references []types.Reference
	for rows.Next() {
		ref, err := scanRowIntoReference(rows)
		if err != nil {
			utils.LogMessage(utils.ERROR, "Error scanning reference row:", err)
			continue
		}
		references = append(references, *ref)
	}

	return references, nil
}

func (s *Store) GetReferenceByID(id int) (*types.Reference, error) {
	query := `SELECT id, display_val, value FROM reference WHERE id = ?`
	rows, err := s.db.Query(query, id)
	if err != nil {
		utils.LogMessage(utils.ERROR, "Error querying reference by ID:", err)
		return nil, err
	}
	defer rows.Close()

	if rows.Next() {
		ref, err := scanRowIntoReference(rows)
		if err != nil {
			utils.LogMessage(utils.ERROR, "Error scanning reference row:", err)
			return nil, err
		}
		return ref, nil
	}

	return nil, sql.ErrNoRows
}

func scanRowIntoReference(row *sql.Rows) (*types.Reference, error) {
	ref := new(types.Reference)
	err := row.Scan(
		&ref.ID,
		&ref.DisplayVal,
		&ref.Value,
	)
	if err != nil {
		utils.LogMessage(utils.ERROR, "Error scanning reference row:", err)
		return nil, err
	}
	return ref, nil
}
