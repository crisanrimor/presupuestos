const ingresos = [];
const egresos = [];

document.addEventListener('DOMContentLoaded', () => {
    cargarApp();
});

document.querySelector('.presupuesto__formulario').addEventListener('click', e => {
    e.preventDefault();
    if(e.target.classList.contains('presupuesto__cta') || e.target.classList.contains('bx-check')){
        agregarDato();
    }

    if(e.target.classList.contains('presupuesto__save') || e.target.classList.contains('bxs-save')){
        datoEditado();
    }
    e.stopPropagation();
})

document.querySelector('.presupuesto__tablas').addEventListener('click', e => {
    capturarEvento(e);
})

const fragment = document.createDocumentFragment();

const cargarApp = () => {
    if(localStorage.getItem('ingresos')){
        const ingresosLocal = JSON.parse(localStorage.getItem('ingresos'));
        ingresosLocal.forEach(element => {
            ingresos.push( new Ingreso(element._descripcion, element._valor, element._fecha) );
        })
    }

    if(localStorage.getItem('egresos')){
        const egresosLocal = JSON.parse(localStorage.getItem('egresos'));
        egresosLocal.forEach(element => {
            egresos.push( new Egreso(element._descripcion, element._valor, element._fecha) );
        })
    }
    
    cargarPresupuesto();
    cargarIngresos();
    cargarEgresos();
}

const totalIngresos = () => {
    return ingresos.reduce( (total, elemento) => total + elemento.valor, 0 );
}

const totalEgresos = () => {
    return egresos.reduce( (total, elemento) => total + elemento.valor, 0 );
}

const cargarPresupuesto = () => {
    const presupuesto = totalIngresos() - totalEgresos();
    const porcentaje = totalEgresos() / totalIngresos() ;
    document.querySelector('.presupuesto__disponible').textContent = formatoMoneda(presupuesto);
    document.querySelector('.presupuesto__ingresos').lastElementChild.firstElementChild.textContent = formatoMoneda(totalIngresos());
    document.querySelector('.presupuesto__egresos').lastElementChild.firstElementChild.textContent = formatoMoneda(totalEgresos());
    document.querySelector('.presupuesto__egresos').lastElementChild.lastElementChild.textContent = !isNaN(porcentaje) ? formatoPorcentaje(porcentaje) : formatoPorcentaje(0) ;
}

const formatoMoneda = valor => {
    return valor.toLocaleString('es-CO', {style:'currency', currency: 'COP', minimunFractionDigits: 0});
}

const formatoPorcentaje = valor => {
    return valor.toLocaleString('es-CO', {style: 'percent', minimunFractionDigits: 0});
}

const cargarIngresos = () => {
    cargarDatos(ingresos, '.presupuesto__tbingresos');
}

const cargarEgresos = () => {
    cargarDatos(egresos, '.presupuesto__tbegresos');
}

const cargarDatos = (datos, clase) => {
    const tbody = document.querySelector(clase).lastElementChild;
    tbody.innerHTML = '';

    if(datos.length === 0){
        tbody.innerHTML = `
        <tr>
        <td colspan="5" style="text-align:center">No hay registros</td>
        </tr>`;
    }else{
        datos.forEach(element => {
            const tr = document.createElement('TR');
            tr.innerHTML = `
            <tr>
            <td class="presupuesto__td">${element.id}</td>
            <td class="presupuesto__td">${element.descripcion} </td>
            <td class="presupuesto__td">${formatoMoneda(element.valor)}</td>
            <td class="presupuesto__td">${element.fecha}</td>
            <td class="presupuesto__td"><i class='bx bxs-edit-alt presupuesto__ctaedit' ></i><i class='bx bxs-trash presupuesto__ctaelim'></i></td>
            </tr>`;
            fragment.append(tr);
        });

        tbody.appendChild(fragment);
    } 
}

const agregarDato = () => {
    const form = document.forms['formulario'];
    const select = form[0];
    const descripcion = form[1];
    const valor = form[2];
    const getDate = new Date();

    const date = `${getDate.getDate()}/${getDate.getMonth() + 1}/${getDate.getFullYear()} - ${getDate.getHours()}:${ getDate.getMinutes() < 10 ? '0' + getDate.getMinutes(): getDate.getMinutes()}`;

    if(descripcion.value !== '' && valor.value !== ''){
        if(select.value === 'ingreso'){
            ingresos.push(new Ingreso(descripcion.value, +valor.value, date));
            localStorage.setItem('ingresos', JSON.stringify(ingresos));
        }else if(select.value === 'egreso'){
            egresos.push(new Egreso(descripcion.value, +valor.value, date));
            localStorage.setItem('egresos', JSON.stringify(egresos));
        }
        cargarPresupuesto();
        cargarIngresos();
        cargarEgresos();

        descripcion.value = '';
        valor.value = '';
    }
}

const capturarEvento = e => {
    const parent = e.target.parentElement.parentElement.parentElement.parentElement;
    if(parent.classList.contains('presupuesto__tbingresos')){
        if(e.target.classList.contains('presupuesto__ctaedit')){
            editarDato(ingresos, e.target);
        }else if(e.target.classList.contains('presupuesto__ctaelim')){
            eliminarDato(ingresos, e.target);
        }
    }else if(parent.classList.contains('presupuesto__tbegresos')){
        if(e.target.classList.contains('presupuesto__ctaedit')){
            editarDato(egresos, e.target);
        }else if(e.target.classList.contains('presupuesto__ctaelim')){
            eliminarDato(egresos, e.target);
        }
    }

    e.stopPropagation();
}

const eliminarDato = (tipo, target) => {
    const idDato = parseInt(target.parentElement.parentElement.firstElementChild.textContent);
    const findIndex = tipo.findIndex(element => element.id === idDato);
    tipo.splice(findIndex, 1);

    if(tipo === ingresos){
        localStorage.setItem('ingresos', JSON.stringify(tipo));
    }else if(tipo === egresos){
        localStorage.setItem('egresos', JSON.stringify(tipo));
    }

    cargarPresupuesto();
    cargarIngresos();
    cargarEgresos();
}

const editarDato = (tipo, target) => {
    const idDato = parseInt(target.parentElement.parentElement.firstElementChild.textContent);
    const findIndex = tipo.findIndex(element => element.id === idDato);
    const btn = document.createElement('button');
    btn.classList.add('presupuesto__save');
    btn.innerHTML = `<i class='bx bxs-save' ></i>`;
    const inputId = document.createElement('input');
    inputId.setAttribute('type', 'hidden');
    inputId.setAttribute('value', idDato);

    const form = document.forms['formulario'];
    const select = form[0];
    const descripcion = form[1];
    const valor = form[2];
    const btnGuardar = form[3];
    btnGuardar.classList.add('disabled');
    
    if(tipo[findIndex] instanceof Ingreso){
        select.value = 'ingreso';
    }else if(tipo[findIndex] instanceof Egreso){
        select.value = 'egreso';
    }
    select.setAttribute('disabled', true);
    descripcion.value = tipo[findIndex].descripcion;
    valor.value = tipo[findIndex].valor;
    
    if(!form[4]){
        form.appendChild(btn);
    }

    if(!form[5]){
        form.appendChild(inputId);
    }else{
        form.lastElementChild.remove();
        inputId.setAttribute('value', idDato);
        form.appendChild(inputId);
    }

}

const datoEditado = () => {

    const form = document.forms['formulario'];
    const select = form[0];
    const descripcion = form[1];
    const valor = form[2];
    const btnGuardar = form[3];
    const id = form[5];
    const getDate = new Date();
    const date = `${getDate.getDate()}/${getDate.getMonth() + 1}/${getDate.getFullYear()} - ${getDate.getHours()}:${ getDate.getMinutes() < 10 ? '0' + getDate.getMinutes(): getDate.getMinutes()}`;

    if(descripcion.value !== '' && valor.value !== ''){
        if(select.value === 'ingreso'){
            const findIndex = ingresos.findIndex(element => element.id === parseInt(id.value));
            ingresos[findIndex].descripcion = descripcion.value;
            ingresos[findIndex].valor = parseInt(valor.value);
            ingresos[findIndex].fecha = date;
            localStorage.setItem('ingresos', JSON.stringify(ingresos));
        }else if(select.value === 'egreso'){
            const findIndex = egresos.findIndex(element => element.id === parseInt(id.value));
            egresos[findIndex].descripcion = descripcion.value;
            egresos[findIndex].valor = parseInt(valor.value);
            egresos[findIndex].fecha = date;
            localStorage.setItem('egresos', JSON.stringify(egresos));
        }

        select.removeAttribute('disabled');
        form.lastElementChild.remove();
        form.lastElementChild.remove();
        descripcion.value = '';
        valor.value = '';
        btnGuardar.classList.remove('disabled');
    }

    cargarPresupuesto();
    cargarIngresos();
    cargarEgresos();

}
