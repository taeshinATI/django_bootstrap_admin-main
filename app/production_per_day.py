from pymongo import MongoClient
import datetime
import logging
import os
import traceback
from collections import defaultdict

class ExtractVRSData:
    def __init__(self,st_date,end_date,reverse=True,include_nan_date=False) -> None:
        """
        st_date : YYYY-MM-DD
        end_date : YYYY-MM-DD
        """
        self.st_date = str(st_date)
        self.end_date= str(end_date)
        self.reverse = reverse
        self.include_nan_date= include_nan_date
        self.vsinfo =None
        self.db = None
        # self.result= []
        # self.sph = {}
        # self.pph= {}
        self.by_date_strip_num={}
        st=datetime.datetime.strptime(st_date,'%Y-%m-%d')
        end =datetime.datetime.strptime(end_date,'%Y-%m-%d')
        self.datelist =[(end-datetime.timedelta(days=i)).strftime('%Y-%m-%d') for i in range((end-st).days)]

        self.logger= logging.getLogger()
        self.logger.setLevel(logging.INFO)
        self.formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        self.mongo_connect()
        self.calc_strip_num()

    def mongo_connect(self) :
        client =MongoClient(f'mongodb://192.168.3.30:27017')    
        # self.db= client['4AS25to12']
        # self.vsinfo= self.db['vsinfo']
        self.db = client['vrsresult_agg1']
        # self.strip_clc = self.db['by_strip']
        self.by_lot= self.db['by_lot']
        
    def record_log(self,log_type,msg):
        
        date = datetime.datetime.now().strftime('%Y-%m-%d')
        # log_file =f'C:\mongo_log\{date}\error.log'
        log_file =f'{os.getcwd()}\logs\{date}\db_error.log'
        os.makedirs(os.path.dirname(log_file),exist_ok=True)
        file_handler = logging.FileHandler(log_file)
        file_handler.setFormatter(self.formatter)        
        self.logger.addHandler(file_handler)

        if log_type==logging.ERROR:
            self.logger.error(msg)

    
    def calc_strip_num(self) :
        try :
            # p = [    
            #         {'$addFields':{'dtfs':{'$dateFromString':{'dateString':'$vrs_insp_end'}}}},
            #         {'$addFields':{'dts':{'$dateToString':{'format':'%Y-%m-%d','date':'$dtfs'}}}},
            #         {'$match':{'dts':{'$lte':self.end_date,'$gte':self.st_date}}},
            #         {'$group' :{
            #             '_id':{'recipe_name':'$recipe_name'},
            #             'strip_num':{'$sum':{'$size':'$loading_time_list'}},
            #             }}
            #     ]
            # result=[i for i in self.by_lot.aggregate(p)]
            tmpdict= defaultdict(dict)
            for i in self.by_lot.find():
                vrs_st_dt = datetime.datetime.strptime(i['vrs_insp_start'],'%Y-%m-%d %H:%M:%S.%f').strftime('%Y-%m-%d')
                vrs_end_dt = datetime.datetime.strptime(i['vrs_insp_end'],'%Y-%m-%d %H:%M:%S.%f').strftime('%Y-%m-%d')

                if vrs_end_dt>=self.st_date and vrs_end_dt<=self.end_date:
                    if i['recipe_name'] not in tmpdict[vrs_end_dt].keys():
                        tmpdict[vrs_end_dt][i['recipe_name']] =len(i['loading_time_list'])
                    else:
                        tmpdict[vrs_end_dt][i['recipe_name']] +=len(i['loading_time_list'])


            if self.include_nan_date:
                tmp= {dt:{} for dt in self.datelist if dt not in tmpdict.keys()}
                tmpdict.update(tmp)

            if self.reverse:
                self.by_date_strip_num=sorted(tmpdict.items(),key=lambda x: x[0],reverse=True)
            else :
                self.by_date_strip_num=sorted(tmpdict.items(),key=lambda x: x[0])
        except:
            print(traceback.format_exc())
            self.record_log('error',traceback.format_exc())

    @property    
    def get_strip_num(self):
        return self.by_date_strip_num


if __name__ == '__main__':
    ed=ExtractVRSData('2023-01-10', '2023-02-01',reverse=False,include_nan_date=False)
    test = ed.get_strip_num
    test2 = list(test)
    date = [res[0] for res in test]
    model_list = [res[1] for res in test]
    dataset = []
    model_set = set()

    # get all model list
    for i in model_list:
        for model, cnt in zip(i, i.values()):
            model_set.add(model)
    model_set = sorted(list(model_set))

    test_set = {}

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

    import numpy as np
    sample_np = np.array(final_list)
    sample_np = sample_np.T
    # sample_np = sample_np.item()
    res = list(sample_np)

    for i, j in enumerate(res):
        res[i] = [int(x) for x in j]
    # [int(x) for x in data]

    # if value
            # test2[index][1]['asdf'] = 0
        # test['asdf'] = 3
        # [[temp_key, temp_val]] = ((str(key), str(value)) for key, value in i[1].items())
        # for j in model_set:
        #     if temp_key == j:
        #         print('found', j)



    # for i in model_set:
    #     print('target:', i)
    #     res = []
    #     for index, j in enumerate(test2):
    #         val = j[1]
    #         if len(val) > 1:
    #             for ii, model in enumerate(val):
    #                 # print(model)
    #                 if model == i:
    #                     print(type(val), model)
    #                     pass
    #                     # print(model, 'found')
    #                     # res.append()
    #                     # pass
    #                     # res.append()
    #         else:
    #             [[temp_key, temp_val]] = ((str(key), str(value)) for key, value in val.items())
    #             if temp_key == i:
    #                 pass
    #                 print(temp_key, 'found!!!')

                # print(str(k), str(v))
                # print(str(val.keys()), val.values())
                # if str(val[1]) == i:
                #     print('found2!')
            # else:

            # if val == i:
            #     print(val)
            # for k in val:
            #     print(k)

    # get processed data for graph
    # for i in model_list:
    #     res = []
    #     print('input:', i)
    #     for j in model_set:
    #         try:
    #             if i[j]:
    #                 print('in', j)
    #                 res.append(i[j])
    #         except:
    #             res.append(0)
    #     dataset.append(res)

    # print(test)
    # print(date)
    # print(model_set)
    # print(dataset)

