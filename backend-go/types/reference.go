package types

type Reference struct {
	ID         int    `json:"id"`
	DisplayVal string `json:"display_val"`
	Value      int    `json:"value"`
}

type ReferenceStore interface {
	GetAllReferences() ([]Reference, error)
	GetReferenceByID(id int) (*Reference, error)
}
