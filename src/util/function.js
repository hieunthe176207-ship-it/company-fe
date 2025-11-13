export const setSession = (aToken, rToken) =>{
    localStorage.setItem("accessToken", aToken)
    localStorage.setItem("refreshToken", rToken)
}
export const clearSession = () => {
    localStorage.removeItem("accessToken"),
    localStorage.removeItem("refreshToken")
}