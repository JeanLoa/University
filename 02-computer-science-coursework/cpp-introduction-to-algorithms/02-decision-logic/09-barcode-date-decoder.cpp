#include <iostream>
#include <string>

using namespace std;

int main() {
    string codigo;
    cout << "Ingresa el codigo de barras: ";
    cin >> codigo;
    (codigo.length() != 12) ? cout << "El codigo ingresado es incorrecto", exit(0) : (void)0;
    string dia = codigo.substr(0, 2);
    string mes = codigo.substr(2, 2);
    string año = codigo.substr(4, 4);
    char tipo = stoi(codigo.substr(8, 2));
    int perecible = stoi(codigo.substr(10, 2));

    cout << "Dia de vencimiento: " << dia << endl;
    cout << "Mes de vencimiento: " << mes << endl;
    cout << "Ano de vencimiento: " << año << endl;
    cout << "Tipo de producto: " << tipo << endl;
    cout << "Es perecible (0: No, 1: Si): " << ((perecible == 0) ? "1" : "0");

    return 0;
}
