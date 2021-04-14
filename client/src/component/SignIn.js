import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { connect } from 'react-redux';
import * as loginActions from '../store/modules/login';
import { bindActionCreators } from "redux";

axios.defaults.withCredentials = true;


function SignIn() {
    const signInStyles = makeStyles((theme) => ({
    root: {
      "& > *": {
        flexGrow: 1,
        background: "#f1f3f5",
      },
    },

    paper: {
      padding: theme.spacing(12),
      textAlign: "center",
    },

    body: {
      height: 350,
      padding: theme.spacing(2),
    },

    footer: {
      zIndex: "-1",
      marginTop: "10vh",
      padding: theme.spacing(0),
      background: "#f1f3f5",
    },

    logo: {
      marginBottom: "3vh",
      textAlign: "center",
      color: theme.palette.text.secondary,
    },

    slogan: {
      fontSize: "1.5vw",
      fontFamily: "Spoqa Han Sans Neo",
    },

    signIn: {
      width: "35vw",
      position: "absolute",
      zIndex: "1",
      background: "white",
      boxShadow: "0px 2px 10px lightgray",
      borderRadius: "1.8rem",
      padding: theme.spacing(5.75),
      textAlign: "center",
      color: theme.palette.text.secondary,
    },

    signInTitle: {
      color: "black",
      fontSize: "1.6vw",
      fontFamily: "Spoqa Han Sans Neo",
      marginBottom: "2.2vh",
    },

    textField: {
      width: "25vw",
      margin: "0.5vw",
      fontFamily: "Spoqa Han Sans Neo",
      borderRadius: "0",
    },

    buttonSignIn: {
      width: "10vw",
      margin: "1vw",
      fontFamily: "Spoqa Han Sans Neo",
      fontWeight: "bold",
      color: "#ff8a4e",
      background: "white",
      border: "2px solid #ff8a4e",
      borderRadius: "0.8rem",
      boxShadow: "none",
      "&:hover": {
        background: "#ff8a4e",
        color: "white",
        boxShadow: "none",
      },
    },

    buttonSignUp: {
      width: "10vw",
      margin: "1vw",
      fontFamily: "Spoqa Han Sans Neo",
      fontWeight: "bold",
      color: "gray",
      background: "white",
      border: "2px solid gray",
      borderRadius: "0.8rem",
      boxShadow: "none",
      "&:hover": {
        background: "gray",
        color: "white",
        boxShadow: "none",
      },
    },
    }));

  // Redux
  function storeUserid(value) {
    const { LoginActions } = loginActions;
    LoginActions.user_id(value)
  }

  function storeNickname(value) {
    const { LoginActions } = loginActions;
    LoginActions.nickname(value)
  }

  function storeEmail(value) {
    const { LoginActions } = loginActions;
    LoginActions.email(value)
  }

  function storeUsertype(value) {
    const { LoginActions } = loginActions;
    LoginActions.usertype(value)
  }

// 로그인 페이지

  const url = `http://localhost:5000`;
  const classes = signInStyles();
  const history = useHistory();
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [values, setValues] = useState({
    showPassword: false,
  });

  // (로그인 폼) 입력 핸들러
  const onChangeHandler = (event) => {
    const {
      target: { name, value },
    } = event;

    if (name === "userEmail") {
      setUserEmail(value);
    } else if (name === "userPassword") {
      setUserPassword(value);
    }
  };

  // 로그인 핸들러
  const onSignInHandler = async (event) => {
    event.preventDefault();
    await axios
      .post(url + "/", {
        method: "POST",
        body: JSON.stringify({
          userEmail: userEmail,
          userPassword: userPassword,
        }),
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.status === 400) {
          alert("로그인 성공");
          sessionStorage.setItem("accessToken", response.data.access_token);
          sessionStorage.setItem("refreshToken", response.data.refresh_token);
          // redux-dispatch
          storeUserid(response.data.user_object.id)
          storeNickname(response.data.user_object.nickname)
          storeEmail(response.data.user_object.email)
          storeUsertype(response.data.user_object.usertype)
          window.location.replace("/");
        } else if (response.data.status === 401) {
          alert("가입하지 않은 아이디이거나, 잘못된 비밀번호입니다.");
        } else {
          alert("error");
        }
      })
      .catch(() => {
        alert("error for some reason");
      });
  };

  // 회원가입 페이지 이동 핸들러
  const onMoveSignUp = () => {
    history.push({
      pathname: "/sign-up",
    });
  };

  // 패스워드 입력 폼 관련 핸들러
  const handleChange = (prop) => (event) => {
    setUserPassword(event.target.value);
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
          <Grid item xs={12}>
            <div className={classes.signIn}>
              <h2 className={classes.signInTitle}>로그인하기</h2>
              <TextField
                className={classes.textField}
                id="outlined-basic"
                label="이메일"
                variant="outlined"
                name="userEmail"
                type="email"
                value={userEmail}
                onChange={onChangeHandler}
                borderRadius={16}
                required
              />
              <FormControl
                className={clsx(classes.margin, classes.textField)}
                variant="outlined"
              >
                <InputLabel htmlFor="outlined-adornment-password">
                  비밀번호
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={values.showPassword ? "text" : "password"}
                  value={values.password}
                  onChange={handleChange("password")}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {values.showPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  labelWidth={70}
                />
              </FormControl>
              <Button
                // style={{ margin: "0 auto" }}
                className={classes.buttonSignUp}
                variant="contained"
                size="large"
                onClick={onMoveSignUp}
              >
                회원가입
              </Button>
              <Button
                className={classes.buttonSignIn}
                variant="contained"
                size="large"
                onClick={onSignInHandler}
              >
                로그인
              </Button>
            </div>
          </Grid>
  );
}

// const mapStateToProps = (state) => ({
//   user_id: state.login.user_id,
//   nickname: state.login.nickname,
//   email: state.login.email,
//   usertype: state.login.usertype
// });

// const mapDispatchToProps = (dispatch) => ({
//   user_id: () => dispatch(loginActions.user_id()),
//   nickname: () => dispatch(loginActions.nickname()),
//   email: () => dispatch(loginActions.email()),
//   usertype: () => dispatch(loginActions.usertype())
// });

export default connect(
  ({ login }) => ({
    user_id: login('user_id'),
    nickname: login('nickname'),
    eamil: login('email'),
    usertype: login('usertype')
  }),
  (dispatch) => ({
    LoginActions: bindActionCreators(loginActions, dispatch)
  })
)(SignIn);