class Dato{
    constructor(descripcion, valor, fecha){
        this._descripcion = descripcion;
        this._valor = valor;
        this._fecha = fecha;
    }

    get descripcion(){
        return this._descripcion;
    }

    set descripcion(descripcion){
        this._descripcion = descripcion;
    }

    get valor(){
        return this._valor;
    }

    set valor(valor){
        this._valor = valor;
    }

    get fecha(){
        return this._fecha;
    }

    set fecha(fecha){
        this._fecha = fecha;
    }

}