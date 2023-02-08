from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.db.models import ObjectDoesNotExist
from django.http import JsonResponse, HttpResponse
from .core.process_machine import *
import random
import json
from .production_per_day import *
from .ExtractVRSModelData import *
from django.views.decorators.csrf import csrf_exempt
# from asgiref.sync import async_to_sync
from json import JSONEncoder


def index(request):
    if request.user.is_anonymous:
        return redirect("/login.html")
    return html(request, "index")

def clicked_model(request):
    if request.method == 'POST':
        result = json.loads(request.body)
        if result:
            # {'date': '2021-01-01', 'label':'6AS0109B01'}
            ed = ExtractVRSModelData()

            # print(ed.get_strip_num)
            r = ed.get_process_time('2023-02-05 10:50:12.1222', '2023-02-7 10:50:12.1222')
            res = {'2023-02-01 15:20': {'8801234': 6, '988991': 44},
                   '2023-02-01 15:30': {'8801234': 10, '6455464': 15, '7656345': 50},
                   '2023-02-01 15:40': {'6455464': 15, '443434': 30, '8801234': 33},
                   '2023-02-01 15:50': {'8801234': 55, '7656345': 40},
                   '2023-02-01 16:00': {'8801234': 9, '6455464': 4}}
            lot_set = set()
            date_set = []
            for i, j in res.items():
                list(map((lambda x: lot_set.add(x)), list(j.keys())))
                date_set.append(i)

            lot_set = list(sorted(lot_set))
            data_set = []
            for i, j in res.items():
                for k in lot_set:
                    try:
                        j[f'{k}']
                    except:
                        j[f'{k}'] = 0
                j = dict(sorted(j.items()))
                data_set.append(list(j.values()))

            # labels = df.columns.tolist()
            # data = df.values[0].tolist()

            context = {
                'labels': date_set,
                'data': data_set,
                'lot': lot_set
            }

            return JsonResponse(context)
        else:
            return JsonResponse({'test': 'NOT FOUND'})


def test4(request):
    if request.method == 'POST':
        result = json.loads(request.body)
        if result:
            # {'date': '2021-01-01', 'label':'6AS0109B01'}

            path = r"C:\Users\tspark\Documents\res0131.csv"
            df = pd.read_csv(path)

            labels = df.columns.tolist()
            data = df.values[0].tolist()

            context = {
                'labels': labels,
                'data': data
            }

            return JsonResponse(context)
        else:
            return JsonResponse({'test': 'NOT FOUND'})
    if request.method == 'GET':
        pass


    # return HttpResponse("return")
    # postData = request.form
    # print('inin', postData)
    # if request.method == 'POST':
    #     print('test4 POST IN')
    #     print(request.form['date'])
    #     print(request.form['label'])
    #
    # context = {
    #     'data': [1,3]
    # }
    # return JsonResponse(context)

async def test3(request):
    ed=ExtractVRSData('2023-01-10', '2023-02-01',reverse=False,include_nan_date=False)
    test = ed.get_strip_num
    test2 = list(test)
    date = [res[0] for res in test]
    model_list = [res[1] for res in test]
    model_set = set()

    # get all model list
    for i in model_list:
        for model, cnt in zip(i, i.values()):
            model_set.add(model)
    model_set = sorted(list(model_set))

    for index, val in enumerate(test2):
        value = val[1]
        if len(value) == 1:
            [[temp_key, temp_val]] = ((str(key), str(value)) for key, value in value.items())
            for i in model_set:
                if temp_key == i:
                    pass
                else:
                    test2[index][1][f'{i}'] = 0
        else:
            dict_list = list(val[1])
            for i in model_set:
                if i not in dict_list:
                    test2[index][1][f'{i}'] = 0

    final_list = []

    for i in test2:
        data = i[1]
        data = sorted(data.items())
        res = [j[1] for j in data]
        final_list.append(res)

    sample_np = np.array(final_list)
    sample_np = sample_np.T
    final_list = list(sample_np)
    for i, j in enumerate(final_list):
        final_list[i] = [int(x) for x in j]


    # ed=ExtractVRSData('2023-01-10', '2023-02-01', reverse=False,include_nan_date=False)
    # test = ed.get_strip_num
    # labels = [res[0] for res in test]
    # model_list = [res[1] for res in test]
    # datalist = []
    # models= set()
    #
    # # get all model list
    # for i in model_list:
    #     for model, cnt in zip(i, i.values()):
    #         models.add(model)
    # models = sorted(list(models))
    #
    #
    # # get processed data for graph
    # for i in model_list:
    #     res = []
    #     for j in models:
    #         try:
    #             if i[j]:
    #                 res.append(i[j])
    #         except:
    #             res.append(0)
    #     datalist.append(res)

    # path = r"C:\Users\tspark\Documents\res0127.csv"
    # df = pd.read_csv(path)
    #
    # labels = df.columns[1:].tolist()
    # dataset = []
    # color = '#123456'
    # stack = 'Stack 1'
    #
    # model, datalist = [], []
    #
    # for index, row in df.iterrows():
    #     data_format = {}
    #     data_format['label'] = row[0]
    #     model.append(row[0])
    #     data_format['data'] = row[1:].tolist()
    #     datalist.append(row[1:].tolist())
    #     data_format['backgroundColor'] = color
    #     data_format['stack'] = stack
    #     dataset.append(data_format)

    context = {
        'labels': date,
        'model': model_set,
        'data': final_list,
    }
    return JsonResponse(context)

async def test2(request):
    df = pd.read_csv(
        "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/vaccinations/vaccinations.csv"
    )
    df["date"] = pd.to_datetime(df["date"])

    df = df.sort_values(["date", "iso_code"])
    chars = '0123456789ABCDEF'
    color = ['#' + ''.join(random.sample(chars, 6)) for i in range(10)]
    labels = df['location'][:10]
    condition = (df['total_vaccinations'] > 50) & (df['total_vaccinations'] < 500)
    data = df[condition]['total_vaccinations'].sample(10)

    labels = labels.tolist()
    data = data.tolist()
    data = list([int(x) for x in data])

    context = {
        'labels': labels,
        'data': data,
        'color': color
    }

    return JsonResponse(context)

async def test(request):
    # if request.method == 'POST':
    #     data = json.loads(request.body)
    # labels = ["Jan", "Feb", "Mar", "Apr"]
    # data = [100, 80, 150, 200]

    machine = Machine()
    df = machine.get_df()
    labels = machine.get_x().tolist()
    data = machine.get_y()
    data = list([int(x) for x in data])

    context = {
        'labels': labels,
        'data': data
    }
    return JsonResponse(context)

def html(request, filename):
    # labels = ["Jan", "Feb", "Mar", "Apr"]
    # data = [100, 80, 150, 200]

    # machine = Machine()
    # df = machine.get_df()
    # labels = machine.get_x().tolist()
    # data = machine.get_y()
    # data = list([int(x) for x in data])

    # context = {"filename": filename,
    #            "collapse": "",
    #            "labels": json.dumps(labels),
    #            "data": json.dumps(data)}
    context = {"filename": filename,
               "collapse": ""
               }

    if request.user.is_anonymous and filename != "login":
        return redirect("/login.html")
    if filename == "logout":
        logout(request)
        return redirect("/")
    if filename == "login" and request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        try:
            if "@" in username:
                user = User.objects.get(email=username)
            else:
                user = User.objects.get(username=username)
            user = authenticate(request, username=user.username, password=password)
            if user is not None:
                login(request, user)
                return redirect("/")
            else:
                context["error"] = "Wrong password"
        except ObjectDoesNotExist:
            context["error"] = "User not found"

        print("login")
        print(username, password)
    print('----->', filename, request.method)
    if filename in ["buttons", "cards"]:
        context["collapse"] = "components"
    if filename in ["utilities-color", "utilities-border", "utilities-animation", "utilities-other"]:
        context["collapse"] = "utilities"
    if filename in ["404", "blank"]:
        context["collapse"] = "pages"

    return render(request, f"{filename}.html", context=context)
