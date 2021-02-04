import AsyncStorage from '@react-native-async-storage/async-storage'
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'

//--------------------------------------------------------------------------------------

const saveDataToStorage = (token, userId, expirationDate)=> {
  AsyncStorage.setItem(
    'userData', 
    JSON.stringify({
      token: token,
      userId: userId, 
      expirationDate: expirationDate.toISOString()
    })
  )
}
let timer 
export const setLogoutTimer = expirationTime => {
  return reduxDispatch => {
    timer = setTimeout(() => {
      reduxDispatch(logOut())
    } ,expirationTime );
  }
}
const clearLogoutTimer = () => {
  if(timer) {
    clearTimeout(timer)
  }
}

//--------------------------------------------------------------------------------------
export const signUp = createAsyncThunk("auth/signUp",
  async (signUpObj, thunkApi)=> {
    console.log("signUpObj: ", signUpObj)
    const {email, password} = signUpObj;
    const res = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAMp8zYz5XH0rQbCYnzHMvUwfVOJwT0KrU',
      {
        method: "POST",
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      }
    )
    if( !res.ok ) {
      const errResData = await res.json();
      const errorId = errResData.error.message
      let message = 'signUp process went wrong!'
      if ( errorId === "EMAIL_EXISTS"){
        message = "This email exists already!"
      }
      throw new Error(message)
    }
    const resData = await res.json()
    console.log("signUp resData: ", resData)
    const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn, 10) * 1000)
    saveDataToStorage(resData.idToken, resData.localId, expirationDate)
    thunkApi.dispatch(setLogoutTimer(parseInt(resData.expiresIn,10) * 1000))
    thunkApi.dispatch(authActions.authenticate({token: resData.idToken, userId: resData.localId}))
  }
)

export const signIn = createAsyncThunk("auth/signIn",
  async (signUpObj, thunkApi)=> {
    console.log("enter signIN")
    const {email, password} = signUpObj;
    const res = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAMp8zYz5XH0rQbCYnzHMvUwfVOJwT0KrU',
      {
        method: "POST",
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      }
    )
    console.log("res.ok: ", res.ok)
    if( !res.ok ) {
      const errResData = await res.json();
      const errorId = errResData.error.message
      let message = 'signUp process went wrong!'
      if ( errorId === "EMAIL_NOT_FOUND"){
        message = "This email could not be found!"
      } else if ( errorId === "INVALID_PASSWORD") {
        message = "This password is not valid!"
      }
      throw new Error(message)
    }
    const resData = await res.json()
    console.log("signIn resData: ", resData)
    const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn, 10) * 1000)
    saveDataToStorage(resData.idToken, resData.localId, expirationDate)
    thunkApi.dispatch(setLogoutTimer(parseInt(resData.expiresIn,10) * 1000))
    thunkApi.dispatch(authActions.authenticate({token: resData.idToken, userId: resData.localId}))
  }
)

export const logOut = createAsyncThunk('auth/logOut',
  async (nullObj,{getState}) => {
    clearLogoutTimer()
    AsyncStorage.removeItem('userData')
    
  }
)


const slice = createSlice({
  name: "auth",
  initialState:{
    token: null,
    userId: null
  },
  reducers:{
    authenticate:(state, action) => {
      state.token = action.payload.token
      state.userId = action.payload.userId
    }
  },
  extraReducers:{
    [signUp.rejected] : (state, action) => {
      throw action.error
    },
    [signIn.rejected] : (state, action) => {
      throw action.error
    },
    [logOut.rejected] : (state, action) => {
      throw action.error
    },
    [logOut.fulfilled] : (state, action) => {
      state.token = null
      state.userId = null
    }
  }
})
export const authActions = slice.actions
export default slice.reducer