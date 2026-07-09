#include <iostream>

using namespace std;

int main() {
    float diametro, ingreextra;
    cout << "Ingrese el diametro de la pizza: ";
    cin >> diametro;
    cout << "Ingrese los ingredientes extra: ";
    cin >> ingreextra;
    (floor(ingreextra) != ingreextra) ? (cout << "El valor no es entero", exit(0)) : (void)0;
    float costodia = diametro * 1.5, costoingre = ingreextra * 2.5;
    float costo = costodia + costoingre;
    cout << "El costo por diametro es: " << costodia;
    cout << "\nEl costo por ingredientes extra es: " << costoingre;
    cout << "\nEl costo total por la pizza es: " << costo;

    return 0;
}
