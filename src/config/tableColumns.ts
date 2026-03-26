export interface ColumnDef {
  key: string
  label: string
  sortable: boolean
}

export const PROJECT_COLUMNS: ColumnDef[] = [
  { key: 'id',        label: 'ID',                sortable: true  },
  { key: 'name',      label: 'Назва проекту',     sortable: true  },
  { key: 'taskCount', label: 'Кількість завдань', sortable: true  },
  { key: 'status',    label: 'Статус',            sortable: true  },
  { key: 'createdAt', label: 'Дата створення',    sortable: false },
]

export const TASK_COLUMNS: ColumnDef[] = [
  { key: 'drag',     label: '',                 sortable: false },
  { key: 'id',       label: 'ID',               sortable: false },
  { key: 'title',    label: 'Назва завдання',   sortable: false },
  { key: 'assignee', label: 'Виконавець',       sortable: false },
  { key: 'status',   label: 'Статус',           sortable: true  },
  { key: 'dueDate',  label: 'Термін виконання', sortable: true  },
  { key: 'actions',  label: '',                 sortable: false },
]
