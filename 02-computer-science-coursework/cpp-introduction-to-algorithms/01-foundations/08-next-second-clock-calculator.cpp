#include <iostream>

using namespace std;

int main() {
    int h, m, s;
    cout << "Ingrese la hora (0-23): ";
    cin >> h;
    cout << "Ingrese el minuto (0-59): ";
    cin >> m;
    cout << "Ingrese el segundo (0-59): ";
    cin >> s;

    s = (s + 1 == 60) ? 0 : s;
    m = (m + 1 == 60 && s == 0) ? 0 : (s == 0) ? m + 1 : m;
    h = (h + 1 == 24 && s == 0 && m == 0) ? 0 : (s == 0 && m == 0) ? h + 1 : h;

    cout << "La nueva hora es: " << h << ":" << m << ":" << s;

    return 0;
}
