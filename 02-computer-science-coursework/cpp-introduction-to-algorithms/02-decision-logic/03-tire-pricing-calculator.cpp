#include <iostream>

using namespace std;

int main() {
    int neu, tarifa, costo;
    cout << "Ingrese cuantos neumaticos desea comprar: ";
    cin >> neu;
    tarifa = (neu <= 0) ? 0 : (neu < 3) ? 145 : (neu >= 3 && neu <= 5) ? 138 : 135;
    (tarifa == 0) ? (cout << "El valor no es valido", exit(0)) : (void)0;
    costo = neu * tarifa;
    cout << "El costo de tarifa es " << tarifa << " y se pagara por " << neu << " neumaticos el precio de " << costo << " soles";

    return 0;
}
