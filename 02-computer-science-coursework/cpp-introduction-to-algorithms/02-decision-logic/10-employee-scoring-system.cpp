#include <iostream>

using namespace std;

int main() {
    int añoslaburo;
    char grado;
    int puntaje = 0;
    cout << "Ingrese la cantidad de anos que labora: ";
    cin >> añoslaburo;
    puntaje = (añoslaburo > 0 && añoslaburo < 5) ? puntaje += 5 : (añoslaburo >= 5) ? puntaje += 10 : 0;
    (puntaje == 0) ? cout << "El valor ingresado no es valido", exit(0) : (void)0;
    cout << "Ingresa el grado (Primaria: P, Secundaria: S, Universitario: U, Postgrado: G): ";
    cin >> grado;
    grado = toupper(grado);
    puntaje += (grado == 'P') ? 5 : (grado == 'S') ? 10 : (grado == 'U') ? 20 : (grado == 'G') ? 30 : 0;
    (puntaje == 5 || puntaje == 10) ? cout << "El grado ingresado no ha sido identificado", exit(0) : (void)0;

    cout << "El puntaje por " << añoslaburo << " anos de laburo y por grado " << grado << " es: " << puntaje;

    return 0;
}
