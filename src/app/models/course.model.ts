export interface Discipline {
    dia: string;
    periodo: string;
    nomeProfessor: string;
    nomeDisciplina: string;
    fase: number;
    ch: number;
  }
  
  export interface Course {
    nomeCurso: string;
    disciplinas: Discipline[];
  }