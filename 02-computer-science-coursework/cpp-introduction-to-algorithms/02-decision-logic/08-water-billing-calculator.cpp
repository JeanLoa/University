#include <iostream>
#include <iomanip>

using namespace std;

int main() {
    const int Limite_Gratis = 50;
    const int Limite_Medio = 200;
    const float Costo_Medio = 2.0;
    const float Costo_Alto = 3.5;
    const int Costo_Base = 20;

    int Litros;
    cout << "Ingrese el numero de litros: ";
    cin >> Litros;

    float costo = Costo_Base +
                  (Litros > Limite_Gratis ?
                  (Litros <= Limite_Medio ?
                  (Litros - Limite_Gratis) * Costo_Medio :
                  (Limite_Medio - Limite_Gratis) * Costo_Medio + (Litros - Limite_Medio) * Costo_Alto) : 0);

    cout << fixed << setprecision(2);
    cout << "El costo por " << Litros << " litros de agua es: " << costo << " soles" << endl;

    return 0;
}
