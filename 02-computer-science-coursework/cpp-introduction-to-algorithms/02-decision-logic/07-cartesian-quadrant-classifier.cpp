#include <iostream>

using namespace std;

int main() {
    int x1, y1;
    cout << "Ingrese la coordenada x1: ";
    cin >> x1;
    cout << "Ingrese la coordenara y1: ";
    cin >> y1;
    string verificacion = (x1 > 0 && y1 > 0) ? "Esta en el cuadrante 1" :
                          (x1 < 0 && y1 > 0) ? "Esta en el cuadrante 2" :
                          (x1 < 0 && y1 < 0) ? "Esta en el cuadrante 3" :
                          "Esta en el cuadrante 4";

    cout << verificacion;

    return 0;
}
