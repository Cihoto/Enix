<div id="commonMovementsListSideMenu" class="sideMenu-s">
    <button onClick="closeSideMenuCommonMovementsList()" class="sideMenuBtn" id="closeSideMenuCommonMovementsList" style="border: none;background-color: none;padding: 30px;">
        <img src="./assets/svg/log-out.svg" alt="">
    </button>
    <div class="sideMenuHeader" style="align-items: center;align-content:center;margin-left: 14px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="6" fill="#069B99" />
        </svg>
        <p class="header-P" >Aquí puedes modificar los datos del movimiento recurrente: </p>             
        <span id="commonListTitle" class="commTitleName">__$movementsName$__</span> 
        <br/>
    </div>
    <p style="line-height: normal;text-align: start;margin-left: 16px!important;" id="commonListType">Tipo : _$income$_</p>
    <div class="commonMovsListContainer">

        <table id="commonMovementsListTable">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th>Descripción</th>
                </tr>
            </thead>
            <tbody>
                
            </tbody>
            <tfoot>
    
            </tfoot>
        </table>
    </div>
</div>




