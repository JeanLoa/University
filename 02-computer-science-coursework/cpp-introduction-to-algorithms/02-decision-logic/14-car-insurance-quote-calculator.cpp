
#include <iostream>
#include <string>
#include <iomanip>

using namespace std;

int main() {
    char Modelo, Color;
    int Edad;
    cout << "Ingrese el modelo: ";
    cin >> Modelo;
    Modelo = toupper(Modelo);
    (Modelo == 'A' || Modelo == 'B') ? (void)0 : (cout << "El modelo no ha sido reconocido", exit(0));
    cout << "Ingrese el color: ";
    cin >> Color;
    Color = toupper(Color);
    (Color == 'B' || Color == 'M' || Color == 'O') ? (void)0 : (cout << "El color no ha sido reconocido", exit(0));
    cout << "Ingrese la edad del conductor: ";
    cin >> Edad;
    (Edad > 0) ? (void)0 : (cout << "La edad ingresada no es valida", exit(0));


    double Precio = (Modelo == 'A') ? ((Color == 'B') ? 240.5 : (Color == 'M') ? 330 : 270.5) :
                    (Color == 'B') ? 300 : (Color == 'M') ? 360.5 : 330;
    double Incremento = (Edad < 31) ? 1.25 : (Edad >= 31 && Edad <= 65) ? 1 : 1.10;     
    double PrecioT = Precio * Incremento;

    cout << fixed << setprecision(2);
    cout << "Precio del seguro: " << PrecioT;


    return 0;
}
