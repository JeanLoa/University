#include <iostream>

using namespace std;

int main() {
    double numPizza;
    double PrecioUnitario;

    cout << "Tipo de Pizza [1, 2, 3]: ";
    cin >> numPizza;
    (numPizza == 1 || numPizza == 2 || numPizza == 3) ? (void)0 : (cout << "Se ha ingresado un numero de pizza no valido", exit(0));
    cout << "Precio: ";
    cin >> PrecioUnitario;
    (PrecioUnitario <= 0) ? (cout << "El precio no ha sido valido", exit(0)) : (void)0;
    double Descuento = (numPizza == 1) ? 0.90 : (numPizza == 2) ? 0.85 : 0.80;
    double costo = PrecioUnitario * Descuento;

    cout << "Total a pagar: " << costo;

    return 0;
}
