#include <iostream>

using namespace std;

int main() {
    int sueldo;
    int edad;
    char nacionalidad;

    cout << "Ingrese la edad: ";
    cin >> edad;
    (edad <= 0) ? cout << "Se ha ingresado una edad invalida", exit(0) : (void)0;
    cout << "Ingrese la nacionalidad (E: Extranjero, N: Nacional): ";
    cin >> nacionalidad;
    nacionalidad = toupper(nacionalidad);
    (nacionalidad == 'E' || nacionalidad == 'N') ? (void)0 : cout << "No se ha identificado la nacionalidad", exit(0);
    sueldo = 2500 + (edad >= 15 && edad <= 20) ? 1400 :
                    (edad >= 21 && edad <= 25) ? 1500 :
                    (edad >= 26 && edad <= 30) ? 1200 : 800 + (nacionalidad == 'E') ? 400 : 0;
    cout << "El sueldo con edad " << edad << " y nacionalidad '" << nacionalidad << "' es: " << sueldo;
    return 0;
}
