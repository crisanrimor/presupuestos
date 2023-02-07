class Egreso extends Dato{
    static idEgreso = 0;

    constructor(descripcion, valor, fecha){
        super(descripcion, valor, fecha);
        this._id = ++Egreso.idEgreso;
    }

    get id(){
        return this._id;
    }
}