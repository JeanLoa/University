#include <iostream>

using namespace std;

int main() {
    string verificacion;
    int eh, em, sh, sm;
    int esta;
    int tap = 10, tad = 6;
    int costo;

    cout << "Ingrese la hora de entrada (0-23): ";
    cin >> eh;
    verificacion = (eh >= 0 && eh < 24) ? "Numero valido" : "Numero no valido";
    cout << verificacion;
    (verificacion == "Numero no valido") ? exit(0) : (void)0;

    cout << "\nIngrese el minuto de entrada (0-59): ";
    cin >> em;
    verificacion = (em >= 0 && em < 60) ? "Numero valido" : "Numero no valido";
    cout << verificacion;
    (verificacion == "Numero no valido") ? exit(0) : (void)0;

    cout << "\nIngrese la hora de salida (0-23): ";
    cin >> sh;
    verificacion = (sh >= 0 && sh < 24) ? "Numero valido" : "Numero no valido";
    cout << verificacion;
    (verificacion == "Numero no valido") ? exit(0) : (void)0;

    cout << "\nIngresa el minuto de salida (0-59): ";
    cin >> sm;
    verificacion = (sm >= 0 && sm < 60) ? "Numero valido" : "Numero no valido";
    cout << verificacion;
    (verificacion == "Numero no valido") ? exit(0) : (void)0;

    eh *= 60;
    sh *= 60;

    esta = (sh + sm) - (eh + em);
    esta /= 60;
    costo = (esta > 1) ? tap + (esta - 1) * tad : esta * tap;

    cout << "\nEl costo por estadia en el aparcamiento es: " << costo << " soles";

    return 0;
}
