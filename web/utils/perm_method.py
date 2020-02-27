import itertools

any_value = lambda: None

# forbidden_queries 書式例
# forbidden_queries = {
#     'returned': False,
#     'approved': perm_method.any_value,
#     'price': [
#         {
#             'to': perm_method.any_value,
#             'when' :{
#                 'approved': True
#             }
#         }
#     ]
# }


def request_param_validation(model, forbidden_queries, received_query):
    for q in received_query:
        if q not in forbidden_queries:
            continue

        rule = forbidden_queries[q]
        if type(rule) in [str, int, bool] and rule == received_query[q]:
            return False
        elif rule == any_value:
            return False
        elif type(rule) in [list]:
            for r in rule:
                if 'when' in r and any(
                        eval(f'model.{key}') != r['when'][key]
                        for key, model in zip(r['when'].keys(),
                                              itertools.repeat(model))):
                    continue

                if 'to' in r and (r['to'] == any_value
                                  or r['to'] == received_query[q]):
                    return False
                elif 'from' in r and (r['from'] == any_value
                                      or r['from'] == eval(f'model.{q}')):
                    return False

    return True
