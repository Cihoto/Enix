<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enix - Login</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap" rel="stylesheet">
    <style>
        body{
            margin: 16px ;
        }
        .background{
            display: flex;
            justify-content: center;
            height: 100vh;
            background: #FFF;
            .purpleFilter{
                position: absolute;
                border-radius: 16px;
                height: 50%;
                width: calc(100% - 32px);
                background: rgba(51, 34, 102, 0.80);
            }
            .enixLogo{
                padding : 16px;
                display: flex;
                flex-direction: row;
                gap: 8px;
            }
            .bck{
                width: 100%;
                flex-shrink: 0;
                background: lightgray 50%;
                border-radius: 16px;
            }
        }

        .loginFormContainer{
            position: absolute;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 40px;
            top: 10%;
            left: calc(50% - 178px);
            height: 80%;
            width: 356px;

            .titles{
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
                .mainTitle{
                    color: var(--black-amp-white-white, #FFF);
                    text-align: center;
                    font-family: Helvetica;
                    font-size: 24px;
                    font-style: normal;
                    font-weight: 700;
                    line-height: 130%; /* 32.76px */
                }
                .secondaryTitle{
                    color: var(--black-amp-white-white, #FFF);
                    text-align: center;
                    font-family: Helvetica;
                    font-size: 11.025px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 140%; /* 15.435px */
                }
            }
            .loginBox{
                background: white;
                border-radius: 16px;
                padding: 16px;
                flex-shrink: 0;
                width:100%;
                height: 443px;
                box-shadow: 0 0 16px rgba(0,0,0,0.1);
            }

            .submitBtn{
                display: flex;
                width: 275.625px;
                height: 35.438px;
                padding: 0px 6.3px;
                justify-content: center;
                align-items: center;
                border: none;
                border-radius: 6px;
                background: var(--Cyan-primario, #00C7D4);
                margin: 16px auto 0px;
                
                p{
                    color: var(--black-amp-white-white, #FFF);
                    text-align: center;
                    font-family: Nunito;
                    font-size: 12px;
                    font-style: normal;
                    font-weight: 700;
                    line-height: 150%; /* 18px */
                    color: var(--black-amp-white-white, #FFF);
                    font-family: Nunito;
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 700;
                    line-height: 150%;
                }

            }
            .form-group{
                display: flex;
                flex-direction: column;
                gap: 8px;
                label{
                    font-family: Helvetica;
                    font-size: 11.025px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 140%; /* 15.435px */
                    color: var(--black-amp-white-black, #000);
                }
                input{
                    border: 1px solid #D9D9D9;
                    border-radius: 8px;
                    padding: 8px;
                    font-family: Helvetica;
                    font-size: 11.025px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 140%; /* 15.435px */
                }
            }
        }
    </style>
</head>
<body>
    <div class="background">
        
        <img class="bck" src="./assets/img/loginFlames.png" height="50%">
        <div class="purpleFilter">
            <div class="enixLogo">
                <img src="./assets/svg/enixLogo_pt1.svg" alt="">
                <img src="./assets/svg/enixLogo_pt2.svg" alt="">
            </div>
        </div>
    </div>


    <div class="loginFormContainer">
        <div class="titles">
            <p class="mainTitle">Te damos la bienvenida a Enix</p>
            <p class="secondaryTitle">Utilice estos increíbles formularios para iniciar sesión o crear una nueva cuenta.</p>
        </div>
        <div class="loginBox">
            <form id="loginForm">
                <div class="form-group">
                    <label for="userName">Nombre</label>
                    <input type="text" name="userName" id="userName" required placeholder="Tú nombre completo">
                </div>  
                <div class="form-group">
                    <label for="userEmail">Correo</label>
                    <input type="email" name="userEmail" id="userEmail" required placeholder="Tu correo eléctrico">
                </div>  
                <div class="form-group">
                    <label for="password">Contraseña</label>
                    <input type="password" name="password" id="password" required placeholder="*******" autocomplete="on">
                </div>

                <button class="submitBtn" type="submit"><p>Crear cuenta</p></button>
            </form>
                
        </div>
    </div>

</body> 
<script src="./js/session/login.js"></script>
</html>