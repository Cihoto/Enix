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
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.20.1/moment.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link rel="stylesheet" href="./assets/css/finance.css?v=<?php echo getFileTime($_SERVER['DOCUMENT_ROOT'] . '/assets/css/finance.css'); ?>">
    <!-- DORPZONE -->
    <script src="https://unpkg.com/dropzone@5/dist/min/dropzone.min.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/dropzone@5/dist/min/dropzone.min.css" type="text/css" />
    <!-- TOASTIFY -->
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css">

</head>

<body>

    <head>

    </head>
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
    <script>
    </script>
    <div id="pageContent">
        <nav id="sidebar">
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
                        <button class="btnOpt option active" menuName="Dashboard" contentToPrint="dash">
                            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                                <path d="M8.6617 2.5H2.82837V8.33333H8.6617V2.5Z" stroke="#9393A1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M17.8284 2.5H11.995V8.33333H17.8284V2.5Z" stroke="#9393A1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M17.8284 11.6667H11.995V17.5001H17.8284V11.6667Z" stroke="#9393A1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M8.6617 11.6667H2.82837V17.5001H8.6617V11.6667Z" stroke="#9393A1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <p>Dashboard</p>
                        </button>
                        <button class="btnOpt option" menuName="Flujo_de_caja" contentToPrint="flj">
                            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                                <path d="M14.495 0.833252L17.8284 4.16659L14.495 7.49992" stroke="#9393A1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M2.82837 9.16675V7.50008C2.82837 6.61603 3.17956 5.76818 3.80468 5.14306C4.4298 4.51794 5.27765 4.16675 6.1617 4.16675H17.8284" stroke="#9393A1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M6.1617 19.1667L2.82837 15.8333L6.1617 12.5" stroke="#9393A1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M17.8284 10.8333V12.4999C17.8284 13.384 17.4772 14.2318 16.8521 14.8569C16.2269 15.4821 15.3791 15.8333 14.495 15.8333H2.82837" stroke="#9393A1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <p>Flujo de caja</p>
                        </button>
                        <button class="btnOpt option" menuName="Pagos" contentToPrint="pag">
                            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                                <path d="M10.3284 0.833252V19.1666" stroke="#9393A1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M14.495 4.16675H8.24504C7.47149 4.16675 6.72962 4.47404 6.18264 5.02102C5.63566 5.568 5.32837 6.30987 5.32837 7.08341C5.32837 7.85696 5.63566 8.59883 6.18264 9.14581C6.72962 9.69279 7.47149 10.0001 8.24504 10.0001H12.4117C13.1853 10.0001 13.9271 10.3074 14.4741 10.8544C15.0211 11.4013 15.3284 12.1432 15.3284 12.9167C15.3284 13.6903 15.0211 14.4322 14.4741 14.9791C13.9271 15.5261 13.1853 15.8334 12.4117 15.8334H5.32837" stroke="#9393A1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <p>Pagos</p>
                        </button>
                        <button class="btnOpt option" menuName="Cobros" contentToPrint="cob">
                            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                                <path d="M10.3284 0.833252V19.1666" stroke="#9393A1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M14.495 4.16675H8.24504C7.47149 4.16675 6.72962 4.47404 6.18264 5.02102C5.63566 5.568 5.32837 6.30987 5.32837 7.08341C5.32837 7.85696 5.63566 8.59883 6.18264 9.14581C6.72962 9.69279 7.47149 10.0001 8.24504 10.0001H12.4117C13.1853 10.0001 13.9271 10.3074 14.4741 10.8544C15.0211 11.4013 15.3284 12.1432 15.3284 12.9167C15.3284 13.6903 15.0211 14.4322 14.4741 14.9791C13.9271 15.5261 13.1853 15.8334 12.4117 15.8334H5.32837" stroke="#9393A1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <p>Cobros</p>
                        </button>
                        <button class="btnOpt option" menuName="Documentos_pagados" contentToPrint="paid">
                            <img src="./assets/svg/check-circle.svg" alt="">
                            <p>Documentos pagados</p>
                        </button>
                        <button class="btnOpt option" menuName="Recurrentes" contentToPrint="common">
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
            <div class="xl-card" id="financesCardTableContainer">
                <div class="card-header">
                    <div class="card-header-title">
                        <p id="contentHeader">Flujo de caja</p>
                        <div class="c-header-desc">
                            <p>Detalles de movimiento</p>
                        </div>
                    </div>
                    <div class="card-header-actions">
                        <button id="filterButton" class="filterButton">
                            <img src="./assets/svg/financessvg/filterBtn.svg" alt="">
                            <p>Filtros</p>
                        </button>
                        <button class="act-btn">
                            <img src="./assets/svg/financessvg/downlaodBtn.svg" alt="">
                            <p>Exportar</p>
                        </button>
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
                    <div class="body-header">
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
                    </div>
                    <div class="body-content">
                        <div class="monthSelector">
                            <div id="datePicker" class="dateSelector">
                                <div class="yearPicker">
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
                                </div>
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
                        <div>
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

    <!-- handlers -->
    <script src="./js/finances/tributarieDocuments/tributrarieTableHandlers.js?v=<?php echo time(); ?>"> </script>

    <!-- SIDEMENU HANLDERS -->
    <!-- finances/API/getTributarieDocuments.js?v=<?php echo time(); ?> -->
    <script src="./js/finances/API/commonMovements/getAllCommonMovements.js?v=<?php echo time(); ?>"></script>

    <script src="./js/fileUploader/uploadNewFile.js?v=<?php echo time();?>"></script>

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
            if(!bsResponse.success){
                await closeSession();
            }
            businessSelector.value =  bsResponse.business_db_id;

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