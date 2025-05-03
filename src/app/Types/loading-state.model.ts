// case 1
export interface Loading
{
    state:'loading'
}


// case 2
export interface Loaded<T>
{
    state:'loaded',
    data:T
}

//case 3
export interface Errored{
  state:'error',
  error:'Error'
}
export type LoadingState <T=unknown> = Loading | Loaded<T> | Errored
// export as one of these interfaces
