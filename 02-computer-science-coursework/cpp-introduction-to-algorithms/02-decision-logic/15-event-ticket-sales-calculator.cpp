#include <iostream>
#include <iomanip>

using namespace std;

int main() {
    char Identificador;
    int Entradas;
    char Socio;
    cout << "Ingrese a zona esta registrado: ";
    cin >> Identificador;
    Identificador = toupper(Identificador);
    (Identificador == 'V' || Identificador == 'P' || Identificador == 'E') ? (void)0 : (cout << "El Identificador no ha sido reconocido", exit(0));
    cout << "Ingrese cuantas entradas desea comprar: ";
    cin >> Entradas;
    (Entradas <= 0) ? (cout << "El dato ingresado no ha sido reconocido", exit(0)) : (void)0;
    cout << "Es socio de la U (S: si, N: no): ";
    cin >> Socio;
    Socio = toupper(Socio);
    (Socio == 'S' || Socio == 'N') ? (void)0 : (cout << "El dato ingresado no ha sido reconocido", exit(0));

    double PrecioE = (Identificador == 'V') ? 350 : (Identificador == 'P') ? 130 : 50;
    double DescuentoE = (Entradas >= 3 && Entradas <= 6) ? 0.95 : (Entradas > 6 && Entradas <= 9) ? 0.925 : 0.90;
    double DescuentoS = (Socio == 'S') ? 0.92 : 1;
    double Precio = PrecioE * Entradas * DescuentoE * DescuentoS;

    cout << fixed << setprecision(2);
    cout << "El precio por las entradas es: " << Precio;

    return 0;
}
