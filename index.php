<?php
require_once('./controller/session/sessionManager.php');
require_once('./cacheBuster.php');
$sessionManager = new sessionManager();
if (!isset($_SESSION['loggedin']) || !isset($_SESSION['businessDV'])) {
    $sessionManager->destroy();
    header('Location: ./login.php');
    exit();
}
$isSuperAdmin = $_SESSION['superAdmin'];
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enix | Finanzas</title>
    <link rel="icon" type="image/x-icon" href="./assets/svg/financessvg/enixLogo.svg">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js" integrity="sha512-v2CJ7UaYy4JwqLDIrZUI/4hqeoQieOmAZNXBeQyjo21dadnwR+8ZaIJVT8EE2iyI61OV8e6M8PP2/4hpQINQ/g==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@8.2.6/dist/sweetalert2.all.min.js" integrity="sha256-Ry2q7Rf2s2TWPC2ddAg7eLmm7Am6S52743VTZRx9ENw=" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/start/jquery-ui.css" />
    <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.20.1/moment.min.js"></script> -->
    <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.20.1/moment.min.js"></script> -->

    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.30.1/moment-with-locales.min.js" integrity="sha512-4F1cxYdMiAW98oomSLaygEwmCnIP38pb4Kx70yQYqRwLVCs3DbRumfBq82T08g/4LJ/smbFGFpmeFlQgoDccgg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link rel="stylesheet" href="./assets/css/finance.css?v=<?php echo getFileTime($_SERVER['DOCUMENT_ROOT'] . '/assets/css/finance.css'); ?>">
    <!-- DORPZONE -->
    <script src="https://unpkg.com/dropzone@5/dist/min/dropzone.min.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/dropzone@5/dist/min/dropzone.min.css" type="text/css" />
    <!-- TOASTIFY -->
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css">

</head>

<body>
    <header class="topMenu">
        <div class="topMenuContainer">
            <div class="logoContainer">
                <svg xmlns="http://www.w3.org/2000/svg" width="76" height="30" viewBox="0 0 76 30" fill="none">
                    <path d="M71.1264 29.4706C69.7247 29.4706 68.645 29.0728 67.8873 28.2772C67.1675 27.4438 66.8076 26.2883 66.8076 24.8108V5.37625C66.8076 3.86088 67.1675 2.70541 67.8873 1.90984C68.645 1.07639 69.7247 0.659668 71.1264 0.659668C72.4902 0.659668 73.532 1.07639 74.2518 1.90984C75.0095 2.70541 75.3884 3.86088 75.3884 5.37625V24.8108C75.3884 26.2883 75.0285 27.4438 74.3087 28.2772C73.5889 29.0728 72.5281 29.4706 71.1264 29.4706Z" fill="#332266" />
                    <path d="M37.8442 29.4574C36.4425 29.4574 35.3628 29.0786 34.6051 28.3209C33.8853 27.5632 33.5254 26.4835 33.5254 25.0818V4.90852C33.5254 3.50681 33.8853 2.44605 34.6051 1.72625C35.3628 0.968571 36.4046 0.589728 37.7305 0.589728C39.0943 0.589728 40.1362 0.968571 40.8559 1.72625C41.5757 2.44605 41.9356 3.50681 41.9356 4.90852V8.14762L41.3106 6.27235C42.1819 4.41603 43.4699 2.99537 45.1747 2.01038C46.9174 0.987511 48.8874 0.476074 51.0846 0.476074C53.3198 0.476074 55.1572 0.911744 56.5968 1.78308C58.0364 2.61653 59.1161 3.90459 59.8358 5.64726C60.5556 7.35205 60.9155 9.53039 60.9155 12.1823V25.0818C60.9155 26.4835 60.5367 27.5632 59.779 28.3209C59.0592 29.0786 57.9985 29.4574 56.5968 29.4574C55.2329 29.4574 54.1722 29.0786 53.4145 28.3209C52.6947 27.5632 52.3348 26.4835 52.3348 25.0818V12.5801C52.3348 10.648 51.9749 9.2652 51.2551 8.43175C50.5732 7.56041 49.5124 7.12474 48.0729 7.12474C46.2544 7.12474 44.7959 7.69301 43.6973 8.82953C42.6365 9.96605 42.1061 11.4814 42.1061 13.3756V25.0818C42.1061 27.9989 40.6855 29.4574 37.8442 29.4574Z" fill="#332266" />
                    <path d="M15.9262 29.5711C12.6303 29.5711 9.78903 28.9839 7.40234 27.8095C5.05353 26.5972 3.23509 24.9113 1.94704 22.752C0.696864 20.5547 0.0717773 17.9786 0.0717773 15.0236C0.0717773 12.1444 0.677922 9.6251 1.89021 7.4657C3.1025 5.26842 4.78834 3.56363 6.94773 2.35134C9.145 1.10116 11.6264 0.476074 14.3919 0.476074C16.3998 0.476074 18.2182 0.817033 19.8472 1.49895C21.4763 2.14298 22.878 3.09008 24.0524 4.34026C25.2268 5.55255 26.1171 7.04897 26.7232 8.82953C27.3293 10.5722 27.6324 12.5232 27.6324 14.6826C27.6324 15.4024 27.4051 15.9517 26.9505 16.3306C26.4959 16.6715 25.8329 16.842 24.9616 16.842H7.11821V12.4096H21.4384L20.5292 13.2051C20.5292 11.6519 20.3019 10.3638 19.8472 9.34096C19.3926 8.28021 18.7297 7.48464 17.8583 6.95427C17.0249 6.42389 15.9831 6.1587 14.7329 6.1587C13.3312 6.1587 12.1378 6.48071 11.1529 7.12474C10.1679 7.76877 9.41019 8.69694 8.87982 9.90923C8.34944 11.1215 8.08425 12.5801 8.08425 14.2848V14.7395C8.08425 17.6187 8.74722 19.7402 10.0732 21.104C11.437 22.4678 13.4448 23.1497 16.0967 23.1497C17.0059 23.1497 18.0478 23.0361 19.2222 22.8088C20.3966 22.5815 21.4952 22.2216 22.5181 21.7291C23.3894 21.3124 24.166 21.1798 24.8479 21.3313C25.5298 21.4449 26.0602 21.748 26.4391 22.2405C26.8179 22.733 27.0263 23.3013 27.0641 23.9453C27.1399 24.5893 27.0073 25.2334 26.6664 25.8774C26.3254 26.4835 25.7572 26.995 24.9616 27.4117C23.6735 28.1315 22.215 28.6619 20.586 29.0028C18.9949 29.3817 17.4416 29.5711 15.9262 29.5711Z" fill="#332266" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="27" height="30" viewBox="0 0 27 30" fill="none">
                    <path d="M20.737 0.607318C19.5358 1.02684 19.0037 1.68007 18.1849 2.62872L15.9104 5.56905L13.6211 8.50937V14.5739H18.558L25.4852 5.93668C25.7819 5.46177 26.0478 5.1181 26.2143 4.46646C26.414 3.68502 26.2058 2.53684 25.9323 2.07741C25.3855 1.15856 24.8153 0.744699 24.1094 0.51538C22.8004 0.145952 21.6912 0.274022 20.737 0.607318Z" fill="#FFD700" />
                    <path d="M18.558 14.5737H13.6211V20.5477L18.543 26.9782C19.2402 27.7589 20.5652 29.5695 24.0118 29.3672C24.6499 29.3298 25.5073 28.9676 26.1082 28.2646C26.6805 27.6432 26.9286 26.9782 26.9286 25.9675C26.9286 24.773 26.4728 24.3135 26.0171 23.6704L24.1179 21.3732L18.558 14.5737Z" fill="#00C7D4" />
                    <path d="M8.62315 14.5737H13.6212V20.5463L8.80544 26.7026C7.90373 27.8386 6.78522 28.8159 5.96489 29.0916C4.87113 29.4591 2.77475 29.5979 1.68099 28.8159C0.6788 28.0994 0.439249 27.4376 0.313337 26.6107C0.131464 25.4162 0.774271 24.2217 1.23001 23.6704L8.62315 14.5737Z" fill="#FD7202" />
                    <ellipse cx="4.87578" cy="4.15068" rx="3.85918" ry="3.85917" fill="#332266" />
                </svg>
            </div>

            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="33" viewBox="0 0 32 33" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0002 4.93115H18.6668C20.876 4.93115 22.6668 6.72201 22.6668 8.93115V24.9312C22.6668 27.1403 20.876 28.9312 18.6668 28.9312H18.3335V26.9312C18.3335 25.2743 16.9904 23.9312 15.3335 23.9312C13.6766 23.9312 12.3335 25.2743 12.3335 26.9312V28.9312H12.0002C9.79102 28.9312 8.00016 27.1403 8.00016 24.9312V8.93115C8.00016 6.72201 9.79102 4.93115 12.0002 4.93115ZM12.0002 8.59782C11.4479 8.59782 11.0002 9.04553 11.0002 9.59782C11.0002 10.1501 11.4479 10.5978 12.0002 10.5978H13.3335C13.8858 10.5978 14.3335 10.1501 14.3335 9.59782C14.3335 9.04553 13.8858 8.59782 13.3335 8.59782H12.0002ZM16.3335 9.59782C16.3335 9.04553 16.7812 8.59782 17.3335 8.59782H18.6668C19.2191 8.59782 19.6668 9.04553 19.6668 9.59782C19.6668 10.1501 19.2191 10.5978 18.6668 10.5978H17.3335C16.7812 10.5978 16.3335 10.1501 16.3335 9.59782ZM12.0002 12.5978C11.4479 12.5978 11.0002 13.0455 11.0002 13.5978C11.0002 14.1501 11.4479 14.5978 12.0002 14.5978H13.3335C13.8858 14.5978 14.3335 14.1501 14.3335 13.5978C14.3335 13.0455 13.8858 12.5978 13.3335 12.5978H12.0002ZM11.0002 17.5978C11.0002 17.0455 11.4479 16.5978 12.0002 16.5978H13.3335C13.8858 16.5978 14.3335 17.0455 14.3335 17.5978C14.3335 18.1501 13.8858 18.5978 13.3335 18.5978H12.0002C11.4479 18.5978 11.0002 18.1501 11.0002 17.5978ZM12.0002 20.5978C11.4479 20.5978 11.0002 21.0455 11.0002 21.5978C11.0002 22.1501 11.4479 22.5978 12.0002 22.5978H13.3335C13.8858 22.5978 14.3335 22.1501 14.3335 21.5978C14.3335 21.0455 13.8858 20.5978 13.3335 20.5978H12.0002ZM16.3335 13.5978C16.3335 13.0455 16.7812 12.5978 17.3335 12.5978H18.6668C19.2191 12.5978 19.6668 13.0455 19.6668 13.5978C19.6668 14.1501 19.2191 14.5978 18.6668 14.5978H17.3335C16.7812 14.5978 16.3335 14.1501 16.3335 13.5978ZM17.3335 16.5978C16.7812 16.5978 16.3335 17.0455 16.3335 17.5978C16.3335 18.1501 16.7812 18.5978 17.3335 18.5978H18.6668C19.2191 18.5978 19.6668 18.1501 19.6668 17.5978C19.6668 17.0455 19.2191 16.5978 18.6668 16.5978H17.3335ZM16.3335 21.5978C16.3335 21.0455 16.7812 20.5978 17.3335 20.5978H18.6668C19.2191 20.5978 19.6668 21.0455 19.6668 21.5978C19.6668 22.1501 19.2191 22.5978 18.6668 22.5978H17.3335C16.7812 22.5978 16.3335 22.1501 16.3335 21.5978Z" fill="#332266" />
                <path d="M14.3335 28.9312V26.9312C14.3335 26.3789 14.7812 25.9312 15.3335 25.9312C15.8858 25.9312 16.3335 26.3789 16.3335 26.9312V28.9312H14.3335Z" fill="#332266" />
                <path d="M6.66683 13.6532C4.77502 13.9705 3.3335 15.6159 3.3335 17.5979V23.9181C3.3335 26.1273 5.12436 27.9181 7.3335 27.9181H8.00016V27.9127C7.18183 27.1802 6.66683 26.1159 6.66683 24.9312V13.6532Z" fill="#332266" />
                <path d="M28.3336 22.5128C28.3785 22.4264 28.4344 22.3177 28.4985 22.1901C28.669 21.8506 28.8994 21.3745 29.1397 20.826C29.6094 19.7539 30.1589 18.3126 30.3249 17.0627C30.68 14.3872 29.5118 12.2163 28.7559 11.1232C28.0568 10.1124 26.6103 10.1124 25.9113 11.1232C25.1553 12.2163 23.9871 14.3872 24.3423 17.0627C24.5082 18.3126 25.0577 19.7539 25.5274 20.826C25.7677 21.3745 25.9981 21.8506 26.1686 22.1901C26.2328 22.3177 26.2886 22.4264 26.3336 22.5128V27.5977C26.3336 28.15 26.7813 28.5977 27.3336 28.5977C27.8858 28.5977 28.3336 28.15 28.3336 27.5977V22.5128Z" fill="#332266" />
            </svg>

            <?php
            // print_r($_SESSION);
            if ($isSuperAdmin) {
                echo '<select id="busSelector"></select>';
                // echo '<button style="display:none;" id="bussinessManager">Crear empresa</button>';
            }
            ?>
        </div>
        <div class="topMenuContainer">
            <div class="iconContainer">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
                    <path d="M15.4715 12.9303C15.4131 12.86 15.3558 12.7897 15.2996 12.7219C14.5261 11.7863 14.0582 11.2217 14.0582 8.57342C14.0582 7.20232 13.7302 6.07732 13.0837 5.23357C12.607 4.61025 11.9625 4.1374 11.1132 3.78795C11.1022 3.78187 11.0925 3.77389 11.0843 3.76439C10.7788 2.74135 9.94281 2.05615 8.99992 2.05615C8.05703 2.05615 7.22137 2.74135 6.91586 3.76334C6.90771 3.77249 6.89808 3.78021 6.88738 3.78619C4.90527 4.60217 3.94199 6.16768 3.94199 8.57236C3.94199 11.2217 3.47477 11.7863 2.70062 12.7208C2.64437 12.7887 2.58707 12.8576 2.52871 12.9293C2.37796 13.1111 2.28245 13.3323 2.25348 13.5666C2.22451 13.801 2.26329 14.0388 2.36523 14.2519C2.58215 14.7089 3.04445 14.9926 3.57215 14.9926H14.4316C14.9568 14.9926 15.4159 14.7092 15.6336 14.2543C15.7359 14.0412 15.7751 13.8033 15.7464 13.5686C15.7176 13.3339 15.6222 13.1124 15.4715 12.9303ZM8.99992 17.8062C9.50794 17.8057 10.0064 17.6678 10.4424 17.4071C10.8784 17.1463 11.2356 16.7724 11.4763 16.325C11.4877 16.3036 11.4933 16.2796 11.4926 16.2553C11.4919 16.2311 11.485 16.2074 11.4724 16.1867C11.4599 16.1659 11.4422 16.1487 11.4211 16.1368C11.4 16.1249 11.3761 16.1186 11.3519 16.1187H6.64867C6.62439 16.1186 6.6005 16.1248 6.57932 16.1367C6.55815 16.1486 6.54041 16.1657 6.52785 16.1865C6.51528 16.2073 6.50831 16.231 6.50761 16.2552C6.50691 16.2795 6.51251 16.3036 6.52387 16.325C6.76452 16.7724 7.12175 17.1462 7.55767 17.407C7.9936 17.6677 8.49196 17.8057 8.99992 17.8062Z" fill="#332266" />
                </svg>
            </div>
            <div class="iconContainer">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                    <path d="M10 12.8062C11.0355 12.8062 11.875 11.9667 11.875 10.9312C11.875 9.89562 11.0355 9.05615 10 9.05615C8.96447 9.05615 8.125 9.89562 8.125 10.9312C8.125 11.9667 8.96447 12.8062 10 12.8062Z" fill="#332266" />
                    <path d="M18.3746 12.6499L18.3563 12.6351L17.1235 11.6683C17.0454 11.6065 16.9831 11.5271 16.9417 11.4366C16.9002 11.3461 16.8809 11.247 16.8852 11.1476V10.696C16.8813 10.5972 16.9009 10.4988 16.9423 10.4091C16.9838 10.3193 17.046 10.2406 17.1238 10.1796L18.3563 9.2124L18.3746 9.19756C18.5647 9.03922 18.6922 8.81844 18.7345 8.5747C18.7767 8.33095 18.7308 8.08013 18.6051 7.86709L16.9367 4.98037C16.9348 4.97765 16.9331 4.97477 16.9317 4.97178C16.8052 4.76169 16.6092 4.6025 16.3777 4.52187C16.1461 4.44123 15.8936 4.44424 15.6641 4.53037L15.6504 4.53545L14.2012 5.11865C14.1097 5.15564 14.0108 5.17035 13.9125 5.16159C13.8142 5.15283 13.7194 5.12084 13.636 5.06826C13.5078 4.98753 13.3776 4.91123 13.2453 4.83936C13.1596 4.79284 13.0859 4.72682 13.0303 4.64662C12.9748 4.56642 12.9388 4.47428 12.9254 4.37764L12.7071 2.83115L12.7024 2.80303C12.6548 2.5635 12.5263 2.34763 12.3383 2.1917C12.1504 2.03577 11.9145 1.94928 11.6703 1.94678H8.32971C8.08208 1.94757 7.84267 2.03573 7.65366 2.19572C7.46465 2.35572 7.33817 2.57728 7.2965 2.82139L7.29299 2.84326L7.07541 4.39287C7.06206 4.48924 7.0264 4.58116 6.97127 4.66132C6.91614 4.74148 6.84305 4.80766 6.75783 4.85459C6.62516 4.92605 6.49488 5.00187 6.36721 5.08193C6.28387 5.13419 6.18933 5.16594 6.09134 5.17456C5.99335 5.18319 5.89472 5.16844 5.80353 5.13154L4.35314 4.54561L4.33947 4.54014C4.10957 4.45391 3.85672 4.45102 3.62491 4.53195C3.3931 4.61289 3.197 4.77253 3.07072 4.98311L3.06564 4.9917L1.39494 7.88037C1.26901 8.09363 1.22305 8.34472 1.26528 8.58876C1.3075 8.83279 1.43515 9.05385 1.62541 9.2124L1.64377 9.22725L2.87658 10.194C2.95465 10.2558 3.01696 10.3352 3.05838 10.4257C3.0998 10.5162 3.11916 10.6153 3.11486 10.7147V11.1663C3.11877 11.2651 3.09918 11.3635 3.05769 11.4532C3.0162 11.543 2.95399 11.6217 2.87619 11.6827L1.64377 12.6499L1.62541 12.6647C1.43534 12.8231 1.30779 13.0439 1.26557 13.2876C1.22335 13.5314 1.2692 13.7822 1.39494 13.9952L3.0633 16.8819C3.06522 16.8847 3.06692 16.8875 3.06838 16.8905C3.19479 17.1006 3.3908 17.2598 3.62235 17.3404C3.85391 17.4211 4.10639 17.4181 4.33596 17.3319L4.34963 17.3269L5.79768 16.7437C5.88914 16.7067 5.98809 16.692 6.08637 16.7007C6.18464 16.7095 6.27943 16.7415 6.36291 16.794C6.49103 16.875 6.62124 16.9513 6.75353 17.0229C6.83931 17.0695 6.91295 17.1355 6.96852 17.2157C7.02409 17.2959 7.06004 17.388 7.07346 17.4847L7.29064 19.0312L7.29533 19.0593C7.34295 19.2992 7.47183 19.5154 7.66025 19.6713C7.84868 19.8273 8.08511 19.9136 8.32971 19.9155H11.6703C11.918 19.9147 12.1574 19.8266 12.3464 19.6666C12.5354 19.5066 12.6619 19.285 12.7035 19.0409L12.7071 19.019L12.9246 17.4694C12.9382 17.3729 12.9741 17.2808 13.0296 17.2007C13.0851 17.1205 13.1586 17.0544 13.2442 17.0077C13.3778 16.9358 13.5082 16.8597 13.6348 16.7804C13.7181 16.7281 13.8127 16.6964 13.9107 16.6877C14.0086 16.6791 14.1073 16.6939 14.1985 16.7308L15.6488 17.3147L15.6625 17.3202C15.8924 17.4066 16.1453 17.4096 16.3772 17.3286C16.609 17.2477 16.8051 17.0879 16.9313 16.8772C16.9328 16.8743 16.9345 16.8714 16.9363 16.8687L18.6047 13.9823C18.7309 13.7691 18.777 13.5179 18.7348 13.2738C18.6927 13.0296 18.565 12.8085 18.3746 12.6499ZM13.1215 11.078C13.0931 11.6829 12.8895 12.2666 12.5355 12.7579C12.1815 13.2493 11.6924 13.6272 11.1276 13.8457C10.5628 14.0642 9.94671 14.1139 9.3542 13.9888C8.76168 13.8636 8.2183 13.569 7.79011 13.1408C7.36193 12.7126 7.06739 12.1692 6.94232 11.5766C6.81726 10.9841 6.86704 10.368 7.08563 9.80325C7.30422 9.23849 7.68219 8.74941 8.17358 8.39549C8.66498 8.04157 9.24862 7.83804 9.85353 7.80967C10.2878 7.79055 10.7213 7.862 11.1265 8.01949C11.5317 8.17699 11.8996 8.41706 12.207 8.72446C12.5144 9.03186 12.7544 9.39985 12.9118 9.80504C13.0693 10.2102 13.1407 10.6437 13.1215 11.078Z" fill="#332266" />
                </svg>
            </div>
            <div class="topDivider"></div>
            <div class="iconContainer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                    <path d="M19.08 5.95634L20.7035 6.32772C21.2109 6.44379 21.5445 6.9297 21.4704 7.44492L21.3106 8.55514C21.277 8.78939 21.1613 9.0041 20.9842 9.16108L18.5034 11.3601C18.2419 11.5918 18.1204 11.9433 18.1828 12.287L19.1792 17.7767C19.2453 18.1412 19.1046 18.5123 18.8135 18.7413L18.2835 19.1582C17.8106 19.5301 17.1188 19.4033 16.8086 18.8879L14.8032 15.5571C14.5212 15.0886 13.9153 14.9335 13.4429 15.2089L8.56287 18.0536C8.25293 18.2343 7.86995 18.2351 7.55926 18.0557L3.50017 15.7122C3.02187 15.4361 2.858 14.8245 3.13414 14.3462L3.5858 13.5639C3.81526 13.1665 4.28579 12.9762 4.727 13.1025L7.05735 13.7695C7.35261 13.854 7.67034 13.7982 7.91908 13.618L18.2705 6.12125C18.5039 5.95217 18.799 5.89206 19.08 5.95634Z" fill="#332266" />
                </svg>
            </div>
            <div class="userImgContainer"></div>
        </div>
    </header>
    <div id="infoMenu" style="display: none; 
        position: absolute; 
        background: 
        white; border: 1px solid #ccc;
        padding: 0px 10px;
        box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
        overflow-y: scroll;
        max-width:550px;
        height:350px;">
        <div class="closeContainer">
            <p id="infoCashFlowMessage">*Estos movimientos no se han generado en tu cartola, son proyectados en base a las facturas emitidas y recibidas</p>
            <button id="infoContent">Cerrar</button>
        </div>
        <table id="resumeCashFlowTable">
            <thead>
            </thead>
            <tbody>
            </tbody>
            <tfoot>
            </tfoot>
        </table>
    </div>
    <div id="pageContent">


        <nav id="sidebar" style="display: none;">
            <div class="navHead">
                <h3>Finanzas</h3>
                <?php
                // print_r($_SESSION);
                if ($isSuperAdmin) {
                    echo '<select id="busSelector"></select>';
                    // echo '<button style="display:none;" id="bussinessManager">Crear empresa</button>';
                }
                ?>
            </div>
            <!-- <button id="login">Iniciar sesión</button>-->
            <button id="logout">Cerrar sesión</button>
        </nav>
        <div id="main">

            <div class="main-header">
                <img src="./assets/svg/financessvg/enixLogo.svg" class="enixLogo">
                <div class="header-content">
                    <p class="headerTitle"> Dashboard flujos</p>
                    <div class="header-options">
                        <button class="btnOpt option active" menuName="dash" contentToPrint="dash">
                            <div class="lds-ellipsis financeLoader">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                                <path d="M8.6617 2.5H2.82837V8.33333H8.6617V2.5Z" stroke="#9393A1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M17.8284 2.5H11.995V8.33333H17.8284V2.5Z" stroke="#9393A1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M17.8284 11.6667H11.995V17.5001H17.8284V11.6667Z" stroke="#9393A1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M8.6617 11.6667H2.82837V17.5001H8.6617V11.6667Z" stroke="#9393A1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <p>Dashboard</p>
                        </button>
                        <button class="btnOpt option" menuName="Flujo_de_caja" contentToPrint="flj">
                            <div class="lds-ellipsis financeLoader">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                                <path d="M14.495 0.833252L17.8284 4.16659L14.495 7.49992" stroke="#9393A1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M2.82837 9.16675V7.50008C2.82837 6.61603 3.17956 5.76818 3.80468 5.14306C4.4298 4.51794 5.27765 4.16675 6.1617 4.16675H17.8284" stroke="#9393A1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M6.1617 19.1667L2.82837 15.8333L6.1617 12.5" stroke="#9393A1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M17.8284 10.8333V12.4999C17.8284 13.384 17.4772 14.2318 16.8521 14.8569C16.2269 15.4821 15.3791 15.8333 14.495 15.8333H2.82837" stroke="#9393A1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <p>Flujo de caja</p>
                        </button>
                        <button class="btnOpt option" menuName="Pagos" contentToPrint="pag">
                            <div class="lds-ellipsis financeLoader">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                                <path d="M10.3284 0.833252V19.1666" stroke="#9393A1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M14.495 4.16675H8.24504C7.47149 4.16675 6.72962 4.47404 6.18264 5.02102C5.63566 5.568 5.32837 6.30987 5.32837 7.08341C5.32837 7.85696 5.63566 8.59883 6.18264 9.14581C6.72962 9.69279 7.47149 10.0001 8.24504 10.0001H12.4117C13.1853 10.0001 13.9271 10.3074 14.4741 10.8544C15.0211 11.4013 15.3284 12.1432 15.3284 12.9167C15.3284 13.6903 15.0211 14.4322 14.4741 14.9791C13.9271 15.5261 13.1853 15.8334 12.4117 15.8334H5.32837" stroke="#9393A1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <p>Pagos</p>
                        </button>
                        <button class="btnOpt option" menuName="Cobros" contentToPrint="cob">
                            <div class="lds-ellipsis financeLoader">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                                <path d="M10.3284 0.833252V19.1666" stroke="#9393A1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M14.495 4.16675H8.24504C7.47149 4.16675 6.72962 4.47404 6.18264 5.02102C5.63566 5.568 5.32837 6.30987 5.32837 7.08341C5.32837 7.85696 5.63566 8.59883 6.18264 9.14581C6.72962 9.69279 7.47149 10.0001 8.24504 10.0001H12.4117C13.1853 10.0001 13.9271 10.3074 14.4741 10.8544C15.0211 11.4013 15.3284 12.1432 15.3284 12.9167C15.3284 13.6903 15.0211 14.4322 14.4741 14.9791C13.9271 15.5261 13.1853 15.8334 12.4117 15.8334H5.32837" stroke="#9393A1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <p>Cobros</p>
                        </button>
                        <button class="btnOpt option" menuName="Documentos_pagados" contentToPrint="paid">
                            <div class="lds-ellipsis financeLoader">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                            <img src="./assets/svg/check-circle.svg" alt="">
                            <p>Documentos pagados</p>
                        </button>
                        <button class="btnOpt option" menuName="Recurrentes" contentToPrint="common">
                            <div class="lds-ellipsis financeLoader">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                            <img src="./assets/svg/repeat.svg" alt="">
                            <p>Recurrentes</p>
                        </button>
                    </div>
                </div>
                <img src="./assets/svg/financessvg/screenLogo.svg" alt="">
            </div>
            <div class="cards-container" id="cardsContainer">
                <!-- <div class="card purple">
                    <div class="content">
                        <div class="titles">
                            <p>Saldo en cuenta corriente</p>
                            <div class="sub-txt">
                                <p id="currentBankBalance">$0</p>
                            </div>
                        </div>
                        <div class="info">
                        </div>
                    </div>
                </div>
                <div class="card orange">
                    <div class="content">
                        <div class="titles">
                            <p>Cuentas por cobrar</p>
                            <div class="sub-txt">
                                <p id="totalPendingPayments" class="sub-amount">8</p>
                                <p id="pendingDocuments">$0</p>
                            </div>
                        </div>
                        <div class="info">
                        </div>
                    </div>
                </div>
                <div class="card cyan">
                    <div class="content">
                        <div class="titles">
                            <p>Cuentas por pagar</p>
                            <div class="sub-txt">
                                <p id="totalPendingCharges" class="sub-amount">8</p>
                                <p id="pendingCharges">$0</p>
                            </div>
                        </div>
                        <div class="info">
                        </div>
                    </div>
                </div>
                <div class="card yellow">
                    <div class="content">
                        <div class="titles">
                            <p>Superhávit / Déficit</p>
                            <div class="sub-txt">
                                <p>$0</p>
                            </div>
                        </div>
                        <div class="info">
                        </div>
                    </div>
                </div> -->
            </div>

            <section id="mainContent-dash" class="main-content financialDash">
                <div class="xl-card dash" id="financesCardTableContainer">
                    <div id="cardHeaderTopMenu" class="card-header">
                        <div class="card-header-title">
                            <p id="contentHeader">Flujo de caja</p>
                            <div class="c-header-desc">
                                <p id="descHeader">Detalles de movimiento</p>
                            </div>
                        </div>
                        <div class="card-header-actions">
                            <button id="filterButton" class="filterButton">
                                <img src="./assets/svg/financessvg/filterBtn.svg" alt="">
                                <p>Filtros</p>
                            </button>
                            <!-- <button class="act-btn">
                                <img src="./assets/svg/financessvg/downlaodBtn.svg" alt="">
                                <p>Exportar</p>
                            </button> -->
                            <button class="act-btn" id="uploadManualFiles" onclick="openUploadFinanceFiles()">
                                <img src="./assets/svg/uploadCloud.svg" alt="">
                                <p>Importar</p>
                            </button>
                            <button class="act-primary-btn" onclick="openCommonMovementsSideMenu()">
                                <img src="./assets/svg/financessvg/addOnCircle.svg" alt="">
                                <p>Ingresar movimientos frecuentes</p>
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div id="mainBodyHeader" class="body-header w-100">
                            <div id="periodSelectors">  
                                <button period="daily" class="btnRangeSelector active">
                                    <p>Diario</p>
                                </button>
                                <!-- <button class="btnRangeSelector">
                                    <p>Semanal</p>
                                </button> -->
                                <button period="monthly" class="btnRangeSelector">
                                    <p>Mensual</p>
                                </button>
                            </div>
                            <div id="financeDashHeaderSection" class="financeDashHeaderSection">
                                <p class="tabTitle">Movimientos bancarios</p>
                                <input type="month"
                                    class="monthInput"
                                    name="monthPicker"
                                    id="monthPickerDashBoard"
                                    value="<?php echo date('Y-m'); ?>"
                                    max="<?php echo date('Y-m') ?>" 
                                />
                            </div>

                            <input 
                                type='month'
                                class="monthInput"
                                name="cashFlowDate"
                                id="cashFlowDate"
                                max='<?php echo date('Y-m'); ?>'
                                value="<?php echo date('Y-m'); ?>" 
                            />
                        </div>
                        <div class="body-content">
                            <div id="optionsMenu" class="monthSelector">
                                <div id="datePicker" class="dateSelector">

                                    <!-- <div class="yearPicker">
                                        <p id="yearName"><?php echo date("Y") ?></p>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M3.92993 5.63916L8.42993 10.1392L12.9299 5.63916L13.9906 6.69982L8.42993 12.2605L2.86927 6.69982L3.92993 5.63916Z" fill="#9393A1" />
                                        </svg>
                                        <div class="years">
                                            <?php
                                            $currentYear = date("Y");
                                            $endYear = $currentYear + 6;
                                            for ($year = $currentYear - 1; $year <= $endYear; $year++) {
                                                echo '<p class="yr" yearNumber="' . $year . '">' . $year . '</p>';
                                            }
                                            ?>
                                        </div>
                                    </div>
                                    <div class="monthPicker">
                                        <p id="monthName">Mes en curso</p>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M3.92993 5.63916L8.42993 10.1392L12.9299 5.63916L13.9906 6.69982L8.42993 12.2605L2.86927 6.69982L3.92993 5.63916Z" fill="#9393A1" />
                                        </svg>
                                        <div class="months">
                                            <p class="mnth" monthNumber="1">Enero</p>
                                            <p class="mnth" monthNumber="2">Febrero</p>
                                            <p class="mnth" monthNumber="3">Marzo</p>
                                            <p class="mnth" monthNumber="4">Abril</p>
                                            <p class="mnth" monthNumber="5">Mayo</p>
                                            <p class="mnth" monthNumber="6">Junio</p>
                                            <p class="mnth" monthNumber="7">Julio</p>
                                            <p class="mnth" monthNumber="8">Agosto</p>
                                            <p class="mnth" monthNumber="9">Septiembre</p>
                                            <p class="mnth" monthNumber="10">Octubre</p>
                                            <p class="mnth" monthNumber="11">Noviembre</p>
                                            <p class="mnth" monthNumber="12">Diciembre</p>
                                        </div>
                                    </div> -->
                                </div>

                                <input type="text" id="filterByFolio" placeholder="Buscar Documento">
                                <div id="utilityBtns" class="paidDocsFilters">
                                    <button class="utilityButtons" id="showIssued">Mostrar Emitidas</button>
                                    <button class="utilityButtons" id="showReceived">Mostrar Recibidas</button>
                                    <button class="utilityButtons" id="showAll">Mostrar Todas</button>
                                </div>
                                <!-- <button onClick="cardFilterAllPaymentsDocuments()">asdasd</button> -->
                                <button id="hidePaidDocuments" style="display: none;">
                                    Mostrar documentos pagados
                                </button>
                            </div>


                            <div id="dashTableMenu" class="mainDashTableContainer bordered br-10">
                                <div id="monthSelectorSection" class="monthSelectorSection">
                                    <div class="tableDashOptions">
                                        <div class="tableOptions">
                                            <button class="dashTableRangeBtn active" value="daily">Diario</button>
                                            <button class="dashTableRangeBtn" value="weekly">Semanal</button>
                                        </div>
                                    </div>
                                    <div class="" style="display: flex; ">
                                        <div style="display: flex;gap: 4px;">
                                            <button class="arrowBtn" id="financeDashRangeBack">
                                                <img src="./assets/svg/purpleArrowLeft.svg" alt="">
                                            </button>
                                            <button class="arrowBtn" id="financeDashRangeForth">
                                                <img src="./assets/svg/purpleArrowRight.svg" alt="">
                                            </button>
                                        </div>
                                    </div>

                                    <!-- <div class="monthSelector">
                                    </div>
                                    <div class="monthSection">
                                    </div> -->
                                    <!-- <div >
                                        <div>
                                            <input class="dashTableRange" type="radio" id="daily" name="range" value="daily" checked />
                                            <label for="daily">Diario</label>
                                        </div>
                                        <div>
                                            <input class="dashTableRange" type="radio" id="monthly" name="range" value="monthly" />
                                            <label for="monthly">Semanal</label>
                                        </div>
                                    </div> -->
                                </div>
                                <table id="financialDashBoardTable" class="financeTable">
                                    <thead>
                                        <tr id="financialHeaderRow" class="headerRow">
                                            <th>
                                                <p>Fecha</p>
                                            </th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr id="financialIncomeRow" class="bodyRow">
                                            <td class="rowTitle">
                                                Ingresos
                                            </td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        <tr id="financialOutFlow" class="bodyRow">
                                            <td class="rowTitle">
                                                Egresos
                                            </td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        <tr id="financialAvit" class="bodyTotalRow">
                                            <td class="avitTitle">
                                                Total
                                            </td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                    </tfoot>

                                </table>
                            </div>

                            <div id="financialDashChart">
                                <canvas id="myChart"></canvas>
                            </div>
                            <section id="financeTableContainer" class="horizontalTableContainer">
                                <table id='bankMovementsTableHorizontal' class="">
                                    <thead>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                    <tfoot>
                                    </tfoot>
                                </table>
                            </section>
                        </div>
                    </div>
                </div>

                <section id="sideTableContainer" class="sideTableContainer">

                    <!-- <div id="doughtnutChart" class="xl-card">
                        <div class="card-header">
                            <div class="card-header-title">
                                <p>Clientes y Proveedores</p>
                            </div>
                        </div>
                        
                            
                        <p>Costos fijos</p>
                        <canvas id="doughnutFinance"></canvas>
                    </div> -->
                    <div class="xl-card sideMenuCard">
                        <div class="card-header">
                            <div class="card-header-title" style="padding-left: 16px;">
                                <p class="sideTableTitle">Clientes</p>
                            </div>
                            <div>
                                <div class="yearPicker" style="display: flex; align-items: center; gap: 10px;padding: 10px 16px 10px 0px;">
                                    <!-- <label for="clientSideYearSelector" style="font-weight: bold;">Año:</label> -->
                                    <input type='month'
                                        class="monthInput"
                                        name="clientSideYearSelector"
                                        id="clientSideYearSelector"
                                        max='<?php echo date('Y-m'); ?>'
                                        value="<?php echo date('Y-m'); ?>" />


                                    <!-- <select id="clientSideYearSelector" style="padding: 5px; border-radius: 5px; border: 1px solid #ccc;">
                                        </
                                        // $currentYear = date("Y");
                                        // $endYear = $currentYear + 6;
                                        // for ($year = $currentYear - 1; $year <= $endYear; $year++) {
                                        //     echo "<option value='$year'" . ($year == $currentYear ? " selected" : "") . ">$year</option>";
                                        // }
                                        ?>
                                    </select> -->
                                </div>
                            </div>
                        </div>
                        <div class="card-body bordered br-10">
                            <table id="financeDashClients" class="secondaryTable">
                                <thead>
                                    <tr class="headerRow">
                                        <th class="headerRowTitle">Razón Social</th>
                                        <th class="headerRowTitle">Emitidas</th>
                                        <th class="headerRowTitle">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <!-- <tr class="bodyRow">
                                        <td class="rz">Cliente A</td>
                                        <td class="">12</td>
                                        <td class="">$1200</td>
                                    </tr> -->
                                </tbody>
                                <tfoot>
                                    <!-- <tr class="footerRow">
                                        <td>Totales</td>
                                        <td>15</td>
                                        <td>16.890.000</td>
                                    </tr> -->
                                </tfoot>
                            </table>
                        </div>
                    </div>
                    <div class="xl-card sideMenuCard">
                        <div class="card-header ">
                            <div class="card-header-title" style="padding-left: 16px;">
                                <p class="sideTableTitle">Proveedores</p>
                            </div>
                            <div>

                                <div class="yearPicker" style="display: flex; align-items: center; gap: 10px;padding: 10px 16px 10px 0px;">
                                    <input type='month'
                                        class="monthInput"
                                        name="providerSideYearSelector"
                                        id="providerSideYearSelector"
                                        max='<?php echo date('Y-m'); ?>'
                                        value="<?php echo date('Y-m'); ?>" />
                                    <!-- <input type="month" > -->
                                    <!-- <label for="providerSideYearSelector" style="font-weight: bold;">Año:</label>
                                    <select id="providerSideYearSelector" style="padding: 5px; border-radius: 5px; border: 1px solid #ccc;">
                                         //php < ?php? > GOES HERE 
                                            // $currentYear = date("Y");
                                            // $endYear = $currentYear + 6;
                                            // for ($year = $currentYear - 1; $year <= $endYear; $year++) {
                                            //     echo "<option value='$year'" . ($year == $currentYear ? " selected" : "") . ">$year</option>";
                                            // }
                                        and here ?>
                                    </select> -->
                                </div>
                            </div>
                        </div>
                        <div class="card-body bordered br-10">
                            <table id="financeDashProviders" class="secondaryTable">
                                <thead>
                                    <tr class="headerRow">
                                        <th class="headerRowTitle">Razón Social</th>
                                        <th class="headerRowTitle">Emitidas</th>
                                        <th class="headerRowTitle">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <!-- <tr class="bodyRow">
                                        <td class="rz">Cliente A</td>
                                        <td class="">12</td>
                                        <td class="">$1200</td>
                                    </tr> -->
                                </tbody>
                                <tfoot>

                                </tfoot>
                            </table>
                        </div>
                    </div>
                </section>
            </section>

        </div>
    </div>

    <!-- API CALLS -->
    <script src="./js/finances/API/getMatchesMovements.js?v=<?php echo time(); ?>"></script>
    <script src="./js/finances/API/getDailyBookMovements.js?v=<?php echo time(); ?>"></script>
    <script src="./js/finances/API/getAllTributarieDocuments.js?v=<?php echo time(); ?>"></script>
    <script src="./js/finances/API/getAllMyDocuments.js?v=<?php echo time(); ?>"></script>
    <script src="./js/finances/API/bankMovements/bankMovements.js?v=<?php echo time(); ?>"></script>
    <script src="./js/finances/API/tributarieDocuments/tributarieDocuments.js?v=<?php echo time(); ?>"></script>

    <!-- TOASTIFY -->
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/toastify-js"></script>
    <!-- MODALS -->
    <?php require_once('./includes/modal/headerAsignerModal.php') ?>
    <script src="./js/modal/headerAsignerModal.js?v=<?php echo time(); ?>"></script>

    <p id="matches"></p>
    <!-- SIDEMENUS -->
    <?php require_once('./includes/sidemenu/commonMovements.php') ?>
    <script src="./js/sidemenu/commonMovements.js?v=<?php echo time(); ?>"></script>
    <?php require_once('./includes/sidemenu/uploadFinanceFiles.php') ?>
    <script src="./js/sidemenu/uploadFinanceFiles.js?v=<?php echo time(); ?>"></script>
    <?php require_once('./includes/sidemenu/commonMovementsList.php') ?>
    <script src="./js/finances/commonMovements/renderCommonMovementsListTable.js?v=<?php echo time(); ?>"></script>
    <script src="./js/sidemenu/commonMovementsList.js?v=<?php echo time(); ?>"></script>
    <!-- CARDS -->
    <script src="./js/finances/dailyBook/cards/cashFlow.js?v=<?php echo time(); ?>"> </script>
    <script src="./js/finances/dailyBook/cards/payments.js?v=<?php echo time(); ?>"></script>
    <script src="./js/finances/dailyBook/cards/charges.js?v=<?php echo time(); ?>"></script>
    <script src="./js/finances/dailyBook/cards/cardsHandlers.js?v=<?php echo time(); ?>"></script>
    <!-- DAILY BOOK -->
    <script src="./js/finances/utils/getallDaysInMonth.js?v=<?php echo time(); ?>"></script>
    <script src="./js/finances/bankResume/horizontalView.js?v=<?php echo time(); ?>"></script>
    <script src='./js/finances/dailyBook/renderDailyBookTable.js?v=<?php echo time(); ?>'></script>
    <script src="./js/finances/dailyBook/menuController.js?v=<?php echo time(); ?>"> </script>
    <script src="./js/finances/dailyBook/dailyBookTable.js?v=<?php echo time(); ?>"> </script>
    <script src="./js/finances/utils/getChileanCurrency.js?v=<?php echo time(); ?>"> </script>
    <script src="./js/finances/utils/dayOfTheYear.js?v=<?php echo time(); ?>"> </script>
    <script src="./js/finances/dailyBook/pendingPayments.js?v=<?php echo time(); ?>"> </script>
    <script src="./js/finances/dailyBook/pendingCharges.js?v=<?php echo time(); ?>"> </script>
    <!-- UTILS -->
    <script src="./js/finances/utils/sortDocumentsByDate.js?v=<?php echo time(); ?>"></script>
    <script src="./js/finances/utils/calculatePaidPercentage.js?v=<?php echo time(); ?>"></script>
    <!-- EXCEL -->
    <script src="./js/finances/Excel/getDocumentsFromExcel.js?v=<?php echo time(); ?>"></script>

    <!-- CASHFLOW -->
    <script src="./js/finances/cashFlow/getBankMovementsFromExcel.js?v=<?php echo time(); ?>"></script>
    <script src="./js/finances/cashFlow/renderChashFlowTable.js?v=<?php echo time(); ?>"></script>
    <script src="./js/finances/cashFlow/cashFlowHandlers.js?v=<?php echo time(); ?>"></script>
    <!-- TRIBUTARIE DOCUMENTS -->
    <script src="./js/finances/tributarieDocuments/filterTributarieDocuments.js?v=<?php echo time(); ?>"></script>
    <script src="./js/finances/tributarieDocuments/renderPaymentsTable.js?v=<?php echo time(); ?>"> </script>
    <script src="./js/finances/tributarieDocuments/renderChargeTable.js?v=<?php echo time(); ?>"> </script>
    <script src="./js/finances/tributarieDocuments/filterDocumentsFromAPI.js?v=<?php echo time(); ?>"> </script>
    <script src="./js/finances/tributarieDocuments/paidDocuments/renderPaidDocuments.js?v=<?php echo time(); ?>"> </script>
    <script src="./js/finances/tributarieDocuments/paidDocuments/paidDocumentHandlers.js?v=<?php echo time(); ?>"> </script>
    <!-- COMMON MOVEMENTS -->
    <script src="./js/finances/commonMovements/renderCommonMovementsTable.js?v=<?php echo time(); ?>"></script>
    <script src="./js/finances/commonMovements/getCommonMovements.js?v=<?php echo time(); ?>"></script>
    <script src="./js/finances/commonMovements/commonMovementsHandlers.js?v=<?php echo time(); ?>"></script>
    <script src="./js/finances/commonMovements/commonMovementsListHandlers.js?v=<?php echo time(); ?>"></script>
    <script src="./js/finances/API/commonMovements/update.js?v=<?php echo time(); ?>"></script>

    <!-- CARGA MANUAL -->
    <script src="./js/finances/Excel/readAllDocumentsFromExcel.js?v=<?php echo time(); ?>"></script>

    <!-- CHARTS -->

    <script src="./js/finances/dashboard/chart.js?v=<?php echo time(); ?>"></script>
    <script src="./js/finances/dashboard/table.js?v=<?php echo time(); ?>"></script>
    <script src="./js/finances/dashboard/sideTables.js?v=<?php echo time(); ?>"></script>
    <!-- FINANCIAL STATUS -->
    <script src="./js/finances/API/financialStatus/financialStatus.js?v=<?php echo time(); ?>"></script>

    <!-- handlers -->
    <script src="./js/finances/tributarieDocuments/tributrarieTableHandlers.js?v=<?php echo time(); ?>"> </script>

    <!-- SIDEMENU HANLDERS -->
    <!-- finances/API/getTributarieDocuments.js?v=<?php echo time(); ?> -->
    <script src="./js/finances/API/commonMovements/getAllCommonMovements.js?v=<?php echo time(); ?>"></script>

    <script src="./js/fileUploader/uploadNewFile.js?v=<?php echo time(); ?>"></script>

    <!-- test only -->
    <script src="./js/finances/cashFlow/renderMonthlycashFlow.js"></script>

    <script>
        //  // // // // // // // // // // // iinsertCommonMovementsFromJson();



        // insertCommonMovementsFromJson();

        // async function getCommonMovements(){
        //     const commonMovsResponse = await getAllCommonMovements();
        //     COMMON_MOVEMENTS = commonMovsResponse.data;
        //     // const commonMovements = [];
        //     // const commonMovements = commonMovsResponse.data;
        //     // console.log('commonMovements',commonMovements);
        //     setCommonMovementsInBankMovements();
        //     console.log(bankMovementsData);
        //     return true;
        // }













        // const createBusinessButton = document.getElementById('bussinessManager');

        // createBusinessButton.addEventListener('click', () => {
        //     window.location.href = './business.php';
        // });

        const cardsContainer = document.getElementById('cardsContainer');

        document.addEventListener('DOMContentLoaded', async (e) => {
            const superAdminResponse = await fetch('./controller/session/checkSuperAdmin.php', {
                method: 'POST'
            });
            const superAdminData = await superAdminResponse.json();
            console.log("SUPER ADMIN DATA", superAdminData);
            if (!superAdminData.superAdmin) {
                return;
            }
            const businessSelector = document.getElementById('busSelector');

            const currentBusIdData = getCurrentBussinessId();
            // businessSelector.value = currentBusIdData.businessId;
            const response = await fetch('./controller/Business/getAllBusinesses.php', {
                method: 'POST'
            });
            const data = await response.json();
            data.forEach(business => {
                const algo = business.id === currentBusIdData;
                const option = new Option(business.name, business.id, false, parseInt(business.id) == parseInt(currentBusIdData.businessId));
                businessSelector.appendChild(option);
            });


            const businessIdData = await fetch('./controller/session/getBdBusinessId.php', {
                method: 'POST'
            });
            const bsResponse = await businessIdData.json();
            if (!bsResponse.success) {
                await closeSession();
            }
            businessSelector.value = bsResponse.business_db_id;

        });

        document.addEventListener('change', async (e) => {

            if (e.target.id === 'busSelector') {
                const businessId = e.target.value;
                console.log(businessId);
                const response = await fetch(`./controller/Business/getBusinessData.php`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        businessId: businessId
                    })
                });
                const data = await response.json();
                if (data.error) {
                    const currentBussId = getCurrentBussinessId();
                    console.log(currentBussId);
                    e.target.value = currentBussId.businessId;
                    window.location.reload();
                    return;
                }
                console.log(data);
            }
        });

        async function getCurrentBussinessId() {
            const currentBusId = await fetch('./controller/session/getCurrentBusiness.php', {
                method: 'POST'
            });
            const currentBusIdData = await currentBusId.json();
            console.log("CURRENT BUSINESS ID", currentBusIdData);
            return currentBusIdData;
        }

        // businessSelector.addEventListener('change', async () => {
        //     const businessId = businessSelector.value;
        //     const response = await fetch(`./controller/business/getBusinessData.php`, {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify({
        //             businessId: businessId
        //         })
        //     });
        //     const data = await response.json();
        //     if (data.error) {
        //         const currentBussId = getCurrentBussinessId();
        //         console.log(currentBussId);
        //         businessSelector.value = currentBussId.businessId;
        //         window.location.reload();
        //         return;
        //     }
        //     console.log(data);
        // });

        // document.getElementById('login').addEventListener('click', async () => {
        //     const login = await fetch('./testSession.php');
        //     const data = await login.json();
        //     console.log(data);
        // });
        // console.log(getData());

        // const loginButton = document.getElementById('login');
        // loginButton.addEventListener('click', async () => {
        //     await getData();
        // });

        // async function getData(){
        //     // fetch('./getSessionData.php')
        //     // .then(response => response.json())
        //     // .then(data => console.log(data));
        //     const dataSession = await fetch('./getSessionData.php');
        //     const data = await dataSession.json();=
        //     console.log(data);
        // }

        const closeSessionButton = document.getElementById('logout');
        closeSessionButton.addEventListener('click', async () => {
            console.log('CLOSING SESSION');
            await closeSession();
        });

        async function closeSession() {
            const dataSession = await fetch('./controller/session/closeSession.php', {
                method: 'POST'
            });
            const data = await dataSession.json();

            if (data.success) {
                window.location.reload();
            }
            console.log(data);
        }
    </script>

</html>