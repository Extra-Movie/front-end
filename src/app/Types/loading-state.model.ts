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
  error:any
}
export type LoadingState<T> =
  | { state: 'loading' }
  | { state: 'loaded'; data: T }
  | { state: 'error'; error: string };
// export as one of these interfaces
