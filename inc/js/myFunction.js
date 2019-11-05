Date.prototype.getWeek = function () {
    var onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
}
var d = new Date();
var m = d.getMonth();
var w = d.getWeek() - 1;
console.log(m);

function getChiSoKhoi(myObj, khoi, ten_tuy_chon, thoi_gian) {
    return myObj[khoi].filter((donvi) => {
        return donvi.ten_tuy_chon == ten_tuy_chon && donvi.thoi_gian == thoi_gian
    }).reduce((acc, cur) => {
        return acc += parseInt(cur.chi_so)
    }, 0)
}

function dataKhoi(myObj, khoi, type) {
    //console.log(khoi)
    let sum = myObj[khoi].filter((donvi) => {
        if (type === 'khong_cap_nhat_tuan_truoc') {
            return (donvi.thoi_gian == w - 1)
        }
        else if (type === 'khong_cap_nhat') {
            return (donvi.thoi_gian == w);
        }
        else if (type === 'viec_duoc_giao_thang_truoc') {
            return (donvi.thoi_gian == m - 1 && donvi.ten_tuy_chon == 'viec_duoc_giao_thang')
        }
        else if (type === 'viec_duoc_giao_thang') {
            return (donvi.thoi_gian == m && donvi.ten_tuy_chon == 'viec_duoc_giao_thang')
        }
        else if (type === 'viec_hoan_thanh_khong_dung_han_thang_truoc') {
            return (donvi.thoi_gian == m - 1 && donvi.ten_tuy_chon == 'viec_hoan_thanh_khong_dung_han_thang')
        }
        else if (type === 'viec_hoan_thanh_khong_dung_han_thang') {
            return (donvi.thoi_gian == m && donvi.ten_tuy_chon == 'viec_hoan_thanh_khong_dung_han_thang')
        }
        return donvi.ten_tuy_chon == type
    }).reduce((acc, cur) => {
        return acc += parseInt(cur.chi_so)
    }, 0)
    if (type === 'viec_hoan_thanh_khong_dung_han_thang_truoc')
        return Math.round(sum / getChiSoKhoi(myObj, khoi, 'viec_duoc_giao_thang', m - 1) * 100)
    else if (type === 'viec_hoan_thanh_khong_dung_han_thang')
        return Math.round(sum / getChiSoKhoi(myObj, khoi, 'viec_duoc_giao_thang', m) * 100)
    return sum;
}

function dataKhoi2(myObj, type) {
    return parseInt(myObj[2].filter((donvi) => {
        return (donvi.ten_tuy_chon == type && donvi.ten_don_vi == 'Khối 2')
    })[0].chi_so)
}

function getChiSoDonVi(myObj, khoi, ten_don_vi, ten_tuy_chon, thoi_gian) {
    return myObj[khoi].find((donvi) => {
        return donvi.ten_don_vi == ten_don_vi && donvi.ten_tuy_chon == ten_tuy_chon && donvi.thoi_gian == thoi_gian;
    }).chi_so
}

function dataDonVi(myObj, khoi, type) {
    let data = [];
    let filter = myObj[khoi].filter((donvi) => {
        if (type === 'khong_cap_nhat_tuan_truoc') {
            return (donvi.thoi_gian == w - 1);
        }
        else if (type === 'khong_cap_nhat') {
            return (donvi.thoi_gian == w);
        }
        else if (type === 'viec_duoc_giao_thang_truoc') {
            return (donvi.thoi_gian == m - 1 && donvi.ten_tuy_chon == 'viec_duoc_giao_thang')
        }
        else if (type === 'viec_duoc_giao_thang') {
            return (donvi.thoi_gian == m && donvi.ten_tuy_chon == 'viec_duoc_giao_thang')
        }
        else if (type === 'viec_hoan_thanh_khong_dung_han_thang_truoc') {
            return (donvi.thoi_gian == m - 1 && donvi.ten_tuy_chon == 'viec_hoan_thanh_khong_dung_han_thang')
        }
        else if (type === 'viec_hoan_thanh_khong_dung_han_thang') {
            return (donvi.thoi_gian == m && donvi.ten_tuy_chon == 'viec_hoan_thanh_khong_dung_han_thang')
        }
        return (donvi.ten_tuy_chon == type);
    })
    for (let donvi of filter) {
        if (type === 'viec_hoan_thanh_khong_dung_han_thang_truoc' || type === 'viec_hoan_thanh_khong_dung_han_thang')
            data.push([donvi.ten_don_vi, parseInt(donvi.chi_so / getChiSoDonVi(myObj, khoi, donvi.ten_don_vi, 'viec_duoc_giao_thang', donvi.thoi_gian) * 100)]);
        else
            data.push([donvi.ten_don_vi, parseInt(donvi.chi_so)]);
    }
    return data;
}

function dataTCT(myObj, type) {
    let data = [
        {
            name: 'Khối cơ quan',
            y: dataKhoi(myObj, 4, type),
            drilldown: type + '_4'
        },
        {
            name: 'Khối 1',
            y: dataKhoi(myObj, 1, type),
            drilldown: type + '_1'
        },
        {
            name: 'Khối 2',
            y: dataKhoi(myObj, 2, type),
            drilldown: type + '_2'
        },
        {
            name: 'Khối 3',
            y: dataKhoi(myObj, 3, type),
            drilldown: type + '_3'
        },

    ]
    return data
}
function dataK2(myObj, type) {
    let data = [
        {
            name: 'Khối 2',
            //y: dataKhoi(myObj,2,type),
            y: dataKhoi2(myObj, type),
            drilldown: type + '_2'
        }
    ]
    return data
}

function dataSeries(myObj, types, color) {
    let data = [], name;
    let i = 0;
    for (const type of types) {
        switch (type) {
            //chart1
            case 'viec_duoc_giao':
                name = 'Việc được giao';
                break;
            case 'viec_hoan_thanh_dung_han':
                name = 'Việc hoàn thành đúng hạn';
                break;
            case 'viec_hoan_thanh_khong_dung_han':
                name = 'Việc hoàn thành không đúng hạn';
                break;
            case 'viec_chua_hoan_thanh':
                name = 'Việc chưa hoàn thành';
                break;
            //chart2
            case 'viec_dang_thuc_hien':
                name = 'Việc đang thực hiện';
                break;
            case 'viec_tu_choi':
                name = 'Việc từ chối';
                break;
            case 'viec_tam_dung':
                name = 'Việc tạm dừng';
                break;
            case 'viec_khoi_tao_moi':
                name = 'Việc khởi tạo mới';
                break;
            case 'viec_cho_duyet':
                name = 'Việc chờ duyệt';
                break;
            case 'viec_de_nghi_dung':
                name = 'Việc đề nghị dừng';
                break;
            case 'viec_vuong_mac_de_xuat':
                name = 'Việc vướng mắc đề xuất';
                break;
            case 'viec_khac':
                name = 'Việc khác';
                break;
            //chart4
            case 'viec_duoc_giao_thang_truoc':
                name = `Tổng số công việc cần hoàn thành trong tháng ${m - 1}`;
                break;
            case 'viec_duoc_giao_thang':
                name = `Tổng số công việc cần hoàn thành trong tháng ${m}`;
                break;
            //chart5
            case 'viec_hoan_thanh_khong_dung_han_thang_truoc':
                name = `% Việc chậm tháng ${m - 1}`;
                break;
            case 'viec_hoan_thanh_khong_dung_han_thang':
                name = `% Việc chậm tháng ${m}`;
                break;

            //chartVeco
            case 'khong_cap_nhat':
                name = `Số người không cập nhật công việc trong tuần`;
                break;
            case 'khong_cap_nhat_tuan_truoc':
                name = `Số người không cập nhật công việc trong tuần trước`;
                break;
            //chartNhiemVuThangK2
            case 'nhiem-vu-TGD-giao':
                name = 'Nhiệm vụ TGĐ giao';
                break;
            case 'nhiem-vu-PTGD-giao':
                name = 'Nhiệm vụ PTGĐ giao';
                break;
        }
        let obj;
        if (type === 'nhiem-vu-TGD-giao' || type === 'nhiem-vu-PTGD-giao') {
            obj = {
                name: name,
                data: dataK2(myObj, type),
                color: color,
            }
        }
        else if (type === 'khong_cap_nhat' || type === 'khong_cap_nhat_tuan_truoc' || type === 'viec_duoc_giao_thang_truoc' || type === 'viec_duoc_giao_thang' || type === 'viec_hoan_thanh_khong_dung_han_thang_truoc' || type === 'viec_hoan_thanh_khong_dung_han_thang') {
            obj = {
                name: name,
                data: dataTCT(myObj, type),
                color: color[i++],
            }
        }
        else {
            obj = {
                name: name,
                data: dataTCT(myObj, type),
                color: color,
            }
        }
        data.push(obj);
    }
    return data;
}
function dataSeriesStack(myObj, types, color) {
    let data = [], name;
    for (const type of types) {
        switch (type) {
            //chartKetLuan
            case 'ket-luan-TD':
                name = 'Kết luận đang thực hiện';
                color = '#428bca';
                break;
            case 'ket-luan-TCT':
                name = 'Kết luận TCT';
                color = '#428bca';
                break;
            case 'ket-luan-K2':
                name = 'Kết luận Khối 2';
                color = '#428bca';
                break;
            case 'ket-luan-qua-han-TD':
                name = 'Kết luận quá hạn';
                color = '#a94442';
                break;
            case 'ket-luan-qua-han-TCT':
                name = 'Kết luận quá hạn TCT';
                color = '#a94442';
                break;
            case 'ket-luan-qua-han-K2':
                name = 'Kết luận quá hạn Khối 2';
                color = '#a94442';
                break;
        }
        let obj;
        if (type === 'ket-luan-TD' || type === 'ket-luan-qua-han-TD') {
            obj = {

                name: name,
                data: dataK2(myObj, type),
                color: color,
                stack: 'Kết luận TĐ'
            }
        }
        else if (type === 'ket-luan-TCT' || type === 'ket-luan-qua-han-TCT') {
            obj = {
                showInLegend: false,
                name: name,
                data: dataK2(myObj, type),
                color: color,
                stack: 'Kết luận TCT'
            }
        }
        else {
            obj = {
                showInLegend: false,
                name: name,
                data: dataK2(myObj, type),
                color: color,
                stack: 'Kết luận Khối 2'
            }
        }

        data.push(obj);
    }
    return data;
}
function dataDrilldown(myObj, types) {
    let data = [], name;
    for (let i = 1; i <= 4; i++) {
        for (const type of types) {
            switch (type) {
                //chart1
                case 'viec_duoc_giao':
                    name = 'Việc được giao';
                    break;
                case 'viec_hoan_thanh_dung_han':
                    name = 'Việc hoàn thành đúng hạn';
                    break;
                case 'viec_hoan_thanh_khong_dung_han':
                    name = 'Việc hoàn thành không đúng hạn';
                    break;
                case 'viec_chua_hoan_thanh':
                    name = 'Việc chưa hoàn thành';
                    break;
                //chart2
                case 'viec_dang_thuc_hien':
                    name = 'Việc đang thực hiện';
                    break;
                case 'viec_tu_choi':
                    name = 'Việc từ chối';
                    break;
                case 'viec_tam_dung':
                    name = 'Việc tạm dừng';
                    break;
                case 'viec_khoi_tao_moi':
                    name = 'Việc khởi tạo mới';
                    break;
                case 'viec_cho_duyet':
                    name = 'Việc chờ duyệt';
                    break;
                case 'viec_de_nghi_dung':
                    name = 'Việc đề nghị dừng';
                    break;
                case 'viec_vuong_mac_de_xuat':
                    name = 'Việc vướng mắc đề xuất';
                    break;
                case 'viec_khac':
                    name = 'Việc khác';
                    break;

                //chart4
                case 'viec_duoc_giao_thang_truoc':
                    name = `Tổng số công việc cần hoàn thành trong tháng ${m - 1}`;
                    break;
                case 'viec_duoc_giao_thang':
                    name = `Tổng số công việc cần hoàn thành trong tháng ${m}`;
                    break;
                //chart5
                case 'viec_hoan_thanh_khong_dung_han_thang_truoc':
                    name = `% Việc chậm tháng ${m - 1}`;
                    break;
                case 'viec_hoan_thanh_khong_dung_han_thang':
                    name = `% Việc chậm tháng ${m}`;
                    break;

                // chartVeco
                case 'khong_cap_nhat':
                    name = 'Số người không cập nhật công việc trong tuần';
                    break;
                case 'khong_cap_nhat_tuan_truoc':
                    name = 'Số người không cập nhật công việc trong tuần trước';
                    break;
                //chartNhiemVuThangK2
                case 'nhiem-vu-TGD-giao':
                    name = 'Nhiệm vụ TGĐ giao';
                    break;
                case 'nhiem-vu-PTGD-giao':
                    name = 'Nhiệm vụ PTGĐ giao';
                    break;
            }
            let obj = {
                name: name,
                id: type + "_" + i,
                data: dataDonVi(myObj, i, type)
            }
            data.push(obj);
        }
    }

    return data;
}
function dataDrilldownStack(myObj, types) {
    let data = [], name;
    for (let i = 1; i <= 4; i++) {
        for (const type of types) {
            switch (type) {
                //chartKetLuan
                case 'ket-luan-TD':
                    name = 'Kết luận đang thực hiện';
                    break;
                case 'ket-luan-TCT':
                    name = 'Kết luận TCT';
                    break;
                case 'ket-luan-K2':
                    name = 'Kết luận Khối 2';
                    break;
                case 'ket-luan-qua-han-TD':
                    name = 'Kết luận quá hạn';
                    break;
                case 'ket-luan-qua-han-TCT':
                    name = 'Kết luận quá hạn TCT';
                    break;
                case 'ket-luan-qua-han-K2':
                    name = 'Kết luận quá hạn Khối 2';
                    break;
            }
            let obj;
            if (type === 'ket-luan-TD' || type === 'ket-luan-qua-han-TD') {
                obj = {
                    name: name,
                    id: type + "_" + i,
                    data: dataDonVi(myObj, i, type),
                    stack: 'Kết luận TĐ'
                }
            }
            else if (type === 'ket-luan-TCT' || type === 'ket-luan-qua-han-TCT') {
                obj = {
                    showInLegend: false,
                    name: name,
                    id: type + "_" + i,
                    data: dataDonVi(myObj, i, type),
                    stack: 'Kết luận TCT'
                }
            }
            else {
                obj = {
                    showInLegend: false,
                    name: name,
                    id: type + "_" + i,
                    data: dataDonVi(myObj, i, type),
                    stack: 'Kết luận Khối 2'
                }
            }
            data.push(obj);
        }
    }

    return data;
}

//Chart5//
function dataDepartmentChart5(myObj, parent, tuy_chon, thang) {
    let data = myObj.filter(e => {
        return e.parent == parent && e.tuy_chon == tuy_chon && e.thang == thang;
    })
    let rs = [];
    data.forEach(e => {
        if (e.parent != 'Khối cơ quan' && e.level < 4) {
            rs.push({
                name: e.ten_don_vi,
                y: parseInt(e.data),
                drilldown: e.parent + '-' + e.ten_don_vi + '-' + thang
            })
        }
        else {
            rs.push({
                name: e.ten_don_vi,
                y: parseInt(e.data),
            })
        }

    });
    return rs;
}

function dataSeriesChart5(myObj) {
    return [
        {
            name: `Tổng số việc cần hoàn thành trong tháng ${m - 1}`,
            data: dataDepartmentChart5(myObj, 'Tổng Công Ty', 'tong-so-viec-can-hoan-thanh-trong-thang', m - 1),
            color: '#0275d8'
        },
        {
            name: `Tổng số việc cần hoàn thành trong tháng ${m}`,
            data: dataDepartmentChart5(myObj, 'Tổng Công Ty', 'tong-so-viec-can-hoan-thanh-trong-thang', m),
            color: '#5cb85c'
        }
    ]
}
function dataDrillDownChart5(myObj, department) {
    let rs = [];
    department.forEach(dv => {
        if (dv.parent != 'Khối cơ quan' && dv.level < 4) {
            rs.push({
                name: `Tổng số việc cần hoàn thành trong tháng ${m - 1}`,
                id: `${dv.parent}-${dv.ten_don_vi}-${m - 1}`,
                data: dataDepartmentChart5(myObj, dv.ten_don_vi, 'tong-so-viec-can-hoan-thanh-trong-thang', m - 1)
            })
            rs.push({
                name: `Tổng số việc cần hoàn thành trong tháng ${m}`,
                id: `${dv.parent}-${dv.ten_don_vi}-${m}`,
                data: dataDepartmentChart5(myObj, dv.ten_don_vi, 'tong-so-viec-can-hoan-thanh-trong-thang', m)
            })
        }

    })
    return rs;
}

//Chart6//
function dataDepartmentChart6(myObj, parent, tuy_chon, thang) {
    let data = myObj.filter(e => {
        return e.parent == parent && e.tuy_chon == tuy_chon && e.thang == thang;
    })
    let rs = [];
    data.forEach(e => {
        let sum = myObj.find(element => {
            return element.ten_don_vi == e.ten_don_vi && element.parent == e.parent && element.thang == e.thang && element.tuy_chon == 'tong-so-viec-can-hoan-thanh-trong-thang'
        }).data;
        
        if (e.parent != 'Khối cơ quan' && e.level < 4) {
            rs.push({
                name: e.ten_don_vi,
                y: parseInt(e.data) / parseInt(sum) * 100,
                drilldown: e.parent + '-' + e.ten_don_vi + '-' + thang
            })
        }
        else {
            rs.push({
                name: e.ten_don_vi,
                y: parseInt(e.data) / parseInt(sum) * 100,
            })
        }

    });
    return rs;
}

function dataSeriesChart6(myObj) {
    return [
        {
            name: `Tổng số việc quá hạn chưa hoàn thành tháng ${m - 1}`,
            data: dataDepartmentChart6(myObj, 'Tổng Công Ty', 'viec-cham-chua-hoan-thanh', m - 1),
            color: '#FFA500'
        },
        {
            name: `Tổng số việc quá hạn chưa hoàn thành tháng ${m}`,
            data: dataDepartmentChart6(myObj, 'Tổng Công Ty', 'viec-cham-chua-hoan-thanh', m),
            color: '#a94442'
        }
    ]
}
function dataDrillDownChart6(myObj, department) {
    let rs = [];
    department.forEach(dv => {
        if (dv.parent != 'Khối cơ quan' && dv.level < 4) {
            rs.push({
                name: `Tổng số việc quá hạn chưa hoàn thành tháng ${m - 1}`,
                id: `${dv.parent}-${dv.ten_don_vi}-${m - 1}`,
                data: dataDepartmentChart6(myObj, dv.ten_don_vi, 'viec-cham-chua-hoan-thanh', m - 1)
            })
            rs.push({
                name: `Tổng số việc quá hạn chưa hoàn thành tháng ${m}`,
                id: `${dv.parent}-${dv.ten_don_vi}-${m}`,
                data: dataDepartmentChart6(myObj, dv.ten_don_vi, 'viec-cham-chua-hoan-thanh', m)
            })
        }

    })
    return rs;
}