<div id="commonMovementsSideMenu" class="sideMenu-s">
    <button onClick="closeSideMenuCommonMovements()" class="sideMenuBtn" id="closeSideMenuCommonMovements" style="border: none;background-color: none;padding: 30px;">
        <img src="./assets/svg/log-out.svg" alt="">
    </button>
    <div class="sideMenuHeader" style="align-items: center;align-content:center;margin-left: 14px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="6" fill="#069B99" />
        </svg>
        <p class="header-P">Debes ingresar los campos solicitados para agregar el ingreso frecuente al flujo de caja.</p>
    </div>

    <form id="commonEventsForm">

        <fieldset style="display: flex; justify-content: start;width: fit-content;gap: 50px;">
            <legend>Tipo de movimiento:</legend>
            <div>
                <input type="radio" id="income" name="inOut" value="income" checked />
                <label for="income">Ingreso</label>
            </div>
            <div>
                <input type="radio" id="outcome" name="inOut" value="outcome" />
                <label for="outcome">Egreso</label>
            </div>
        </fieldset>

        <div class="form-group">
            <label for="commonMovementsType">Tipo de movimiento</label>
            <select name="movementType" id="commonMovementsType">
                <option value="2">Recurrente</option>
                <option value="1">Único</option>
            </select>
        </div>
        <div class="form-group">
            <label for="commonMovementDay">Día del movimiento</label>
            <select name="dayNumber" id="commonMovementDay">
                <?php
                for ($i = 1; $i <= 31; $i++) {
                    echo "<option value=\"$i\">$i</option>";
                }
                ?>
            </select>
        </div>
        <section class="dateRangeSelection">
            <div class="form-group">
                <label for="commonMovementFrom">Desde</label>
                <!-- set value to dateFrom on today -->
                <input type="month" name="dateFrom" id="commonMovementFrom" value="<?php echo date('Y-m'); ?>" min="<?php echo date('Y-m'); ?>" required>
            </div>
            <div class="form-group">
                <label for="commonMovementTo">Hasta</label>
                <input type="month" name="dateTo" id="commonMovementTo" min="<?php echo date('Y-m'); ?>" required>
            </div>
        </section>
        <div class="form-group">
            <label for="commonMovementsName">Nombre del movimiento</label>
            <input type="text" name="name" id="commonMovementsName">
            </select>
        </div>
        <div class="form-group">
            <label for="commonMovementAmount">Monto</label>
            <input type="number" class="form-control" id="commonMovementAmount" name="movementTotal">
            <!-- <div class="new-chat-window">
                <i class="fa fa-search">L</i>
                <input type="text" class="new-chat-window-input" id="new-chat-window-input" placeholder="Rechercher" />
            </div> -->
        </div>
        <button type="submit" class="btn btn-primary">Agregar ingreso frecuente</button>
    </form>
    <!-- <button id="cerrarClienteModal">Cerrar</button> -->
</div>




