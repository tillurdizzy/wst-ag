export interface IUserAuth{
  id:string;
  aud:string;
  role:string;
  email:string;
}


export interface IUserAccount {
  id:number,
  created_at?:string
  username: string;
  firstname: string;
  lastname: string;
  role: string;
  email: string;
  cell: string;
  street:string;
  csz:string;
  uuid:string;
  alerts:string;
  units:number[];
  residesAt:number;
  member:boolean;
};

export interface IUserUpdate{
  firstname: string;
  lastname: string;
  cell: string;
  street:string;
  csz:string;

}

export interface IOwner{
  email: string;
  cell: string;
  firstname: string;
  lastname: string;
  street:string;
  csz:string;
}

// All with ?
export interface IProfile {
  id?: number;
  unit?: number;
  firstname: string;
  lastname: string;
  cell: string;
  email: string;

}

// All columns
export interface IProfileFetch {
  id: number;
    unit: number;
    firstname: string;
    lastname: string;
    cell: string;
    email: string;
    uuid?:string;
    description?:string;
    alerts?:string;

};


// less id and unit
export interface IProfileUpdate{
  firstname: string;
  lastname: string;
  cell: string;
  email: string;

}
export interface IResident {
  unit: number;
  id?: number;
  lease: string;
  email: string;
  firstname: string;
  lastname: string;
  cell: string;
  type: string;
};

export interface IVehicle {
  unit:number,
  tag: string,
  make: string,
  model: string,
  color: string,
  name: string,
  space: any,
  id:number,
  link:string,
  sort:string,
  url:string
};

export interface IVehicleTable {
  id:string;
  space: string,
  tag: string,
  make: string,
  color: string,
  model: string,
};

export interface IVehicleUpdate{
  tag: string,
  make: string,
  model: string,
  color: string,
  name: string,
  space?: any,
  id:number,
  unit:number;
};

export interface ISpace{
  tag: string,
  make: string,
  model: string,
  color: string,
  name: string,
};

export interface ISpaceUpdate{
  name: string,
  tag: string,
  make: string,
  model: string,
  color: string,

};

export interface ISpaceBasic{
  tag: string,
  make: string,
  space:string,
};

export interface IWatch{
  id?:number;
  tag: string,
  loc: string,
  created_at: string;
  user?:string;
};


export interface IUnit {
  unit: number;
  street: string;
  bldg:string;
  sqft:number;
  bdrms:number;
};

export interface IResidentAccount{
  id:number;
  firstname: string;
  lastname: string;
  cell: string;
  email: string;
  alerts:string;
  uuid:string;
}

export interface IResidentInsert{
  firstname: string;
  lastname: string;
  cell: string;
  email: string;
}



export interface ISelect{
  value:string;
  viewValue:string;
}




