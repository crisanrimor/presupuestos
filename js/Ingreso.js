class Ingreso extends Dato{
    static idIngreso = 0;

    constructor(descripcion, valor, fecha){
        super(descripcion, valor, fecha);
        this._id = ++Ingreso.idIngreso;
    }

    get id(){
        return this._id;
    }
}