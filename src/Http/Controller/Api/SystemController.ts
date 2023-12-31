import { Request, Response } from 'express';
import { NoContentResponse, SuccessResponse, ClientErrorResponse } from '@Providers/ResponseProvider';
import { findAll } from '@Service/CodeService';
import fs from 'fs';

// 서버 체크
export const CheckStatus = async (req: Request, res: Response): Promise<Response> => {
    return NoContentResponse(res);
};

// 에러
export const ErrorTest = async (req: Request, res: Response): Promise<Response> => {
    return ClientErrorResponse(res, '문제가 발생 했습니다.', Error('에러발생'));
};

// 기본 데이터
export const BaseData = async (req: Request, res: Response): Promise<Response> => {
    let resultCodeStep1 = {};
    let resultCodeStep2 = {};

    const getCode = await findAll();

    resultCodeStep1 = getCode.map((code) => {
        const { code_id, name, group_id, type } = code;
        return {
            type: type,
            group: group_id,
            code: code_id,
            name: name,
        };
    });

    const group = getCode.filter((c) => c.type === `group`);
    const code = getCode.filter((c) => c.type === `code`);

    resultCodeStep2 = group.map((g) => {
        return {
            group: g.group_id,
            name: g.name,
            codes: code
                .filter((cf) => cf.group_id === g.group_id)
                .map((cfg) => {
                    return {
                        code_id: cfg.code_id,
                        name: cfg.name,
                    };
                }),
        };
    });

    return SuccessResponse(res, { code: { basic: resultCodeStep1, group: resultCodeStep2 } });
};

// 서버 공지사항
export const SystemNotice = async (req: Request, res: Response): Promise<void> => {
    if (req) {
        fs.readFile('storage/notice.txt', 'utf-8', (err, data) => {
            if (data === '' || err) {
                return NoContentResponse(res);
            } else {
                return SuccessResponse(res, { notice: data.trim() });
            }
        });
    }
};
